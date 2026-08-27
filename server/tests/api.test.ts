import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import mongoose from 'mongoose'
import type { Express } from 'express'

// Minimum backend test coverage per PORTFOLIO_CMS_PLAN.md §38:
// login success/failure, unauthorized/authorized admin request, project
// CRUD, and public filtering of unpublished projects. Env vars are set
// (and app modules imported) only inside beforeAll, after the in-memory
// MongoDB instance is up, since server/src/config/env.ts validates them
// at import time.

let mongod: MongoMemoryServer
let app: Express
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let UserModel: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ProjectModel: any

const ADMIN_EMAIL = 'admin@example.com'
const ADMIN_PASSWORD = 'correct-horse-battery-staple'

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '1h'
  process.env.CLIENT_URL = 'http://localhost:5173'
  process.env.COOKIE_SECURE = 'false'
  process.env.NODE_ENV = 'test'

  const { createApp } = await import('../src/app.js')
  const { connectToDatabase } = await import('../src/db/connect.js')
  const { hashPassword } = await import('../src/utils/password.js')
  ;({ UserModel } = await import('../src/models/User.js'))
  ;({ ProjectModel } = await import('../src/models/Project.js'))

  await connectToDatabase()
  app = createApp()

  await UserModel.create({
    email: ADMIN_EMAIL,
    passwordHash: await hashPassword(ADMIN_PASSWORD),
    role: 'admin',
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

beforeEach(async () => {
  await ProjectModel.deleteMany({})
})

async function loginAgent() {
  const agent = request.agent(app)
  await agent.post('/api/auth/login').send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  return agent
}

describe('POST /api/auth/login', () => {
  it('succeeds with correct admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  it('fails with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: 'wrong-password' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe('Invalid email or password')
  })
})

describe('admin authorization', () => {
  it('rejects an unauthenticated request to an admin endpoint', async () => {
    const res = await request(app).get('/api/admin/projects')
    expect(res.status).toBe(401)
  })

  it('allows an authenticated request to an admin endpoint', async () => {
    const agent = await loginAgent()
    const res = await agent.get('/api/admin/projects')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})

describe('project CRUD via the admin API', () => {
  it('creates, updates, and deletes a project', async () => {
    const agent = await loginAgent()

    const createRes = await agent.post('/api/admin/projects').send({
      title: 'Test Project',
      slug: 'test-project',
      description: 'A project created by the test suite.',
      published: true,
    })
    expect(createRes.status).toBe(201)
    expect(createRes.body.data.title).toBe('Test Project')
    const id = createRes.body.data._id

    const updateRes = await agent
      .put(`/api/admin/projects/${id}`)
      .send({ title: 'Updated Project Title' })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.data.title).toBe('Updated Project Title')

    const deleteRes = await agent.delete(`/api/admin/projects/${id}`)
    expect(deleteRes.status).toBe(200)

    const listRes = await agent.get('/api/admin/projects')
    expect(listRes.body.data).toHaveLength(0)
  })

  it('preserves untouched fields on a partial update (regression: defaults must not overwrite them)', async () => {
    const agent = await loginAgent()

    const createRes = await agent.post('/api/admin/projects').send({
      title: 'Partial Update Test',
      slug: 'partial-update-test',
      description: 'x',
      published: true,
      featured: true,
      displayOrder: 5,
      technologies: ['React'],
    })
    const id = createRes.body.data._id

    const updateRes = await agent
      .put(`/api/admin/projects/${id}`)
      .send({ title: 'Partial Update Test (edited)' })

    expect(updateRes.status).toBe(200)
    expect(updateRes.body.data.title).toBe('Partial Update Test (edited)')
    expect(updateRes.body.data.published).toBe(true)
    expect(updateRes.body.data.featured).toBe(true)
    expect(updateRes.body.data.displayOrder).toBe(5)
    expect(updateRes.body.data.technologies).toEqual(['React'])

    const publicRes = await request(app).get('/api/projects/partial-update-test')
    expect(publicRes.status).toBe(200)
  })
})

describe('GET /api/health', () => {
  it('returns ok without exposing secrets', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body.data.status).toBe('ok')
    expect(JSON.stringify(res.body)).not.toContain(process.env.MONGODB_URI)
  })
})

describe('session lifecycle', () => {
  it('GET /api/auth/me returns 401 when unauthenticated and the admin when authenticated', async () => {
    const unauthenticated = await request(app).get('/api/auth/me')
    expect(unauthenticated.status).toBe(401)

    const agent = await loginAgent()
    const authenticated = await agent.get('/api/auth/me')
    expect(authenticated.status).toBe(200)
    expect(authenticated.body.data.user.email).toBe(ADMIN_EMAIL)
  })

  it('POST /api/auth/logout clears the session so /me becomes unauthorized again', async () => {
    const agent = await loginAgent()
    expect((await agent.get('/api/auth/me')).status).toBe(200)

    const logoutRes = await agent.post('/api/auth/logout')
    expect(logoutRes.status).toBe(200)

    expect((await agent.get('/api/auth/me')).status).toBe(401)
  })
})

describe('validation', () => {
  it('rejects an admin project create request missing a required field', async () => {
    const agent = await loginAgent()
    const res = await agent.post('/api/admin/projects').send({ slug: 'no-title' })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.errors.some((e: { field: string }) => e.field === 'title')).toBe(true)
  })

  it('rejects a duplicate project slug', async () => {
    const agent = await loginAgent()
    await agent.post('/api/admin/projects').send({
      title: 'First',
      slug: 'dup-slug',
      description: 'x',
    })
    const res = await agent.post('/api/admin/projects').send({
      title: 'Second',
      slug: 'dup-slug',
      description: 'y',
    })
    expect(res.status).toBe(400)
    expect(res.body.success).toBe(false)
  })
})

describe('GET /api/projects', () => {
  it('returns only published projects, excluding unpublished ones', async () => {
    await ProjectModel.create([
      { title: 'Published', slug: 'published', description: 'x', published: true },
      { title: 'Draft', slug: 'draft', description: 'x', published: false },
    ])

    const res = await request(app).get('/api/projects')
    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].slug).toBe('published')
  })
})
