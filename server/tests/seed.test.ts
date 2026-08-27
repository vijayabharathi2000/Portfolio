import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

// Verifies server/scripts/seed.ts (task 7.2/7.3): it upserts the admin user,
// profile, Voyager project, skills, and experience using the values in
// client/src/data/*.ts, and re-running it does not create duplicates.

let mongod: MongoMemoryServer
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let seed: () => Promise<void>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let UserModel: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ProfileModel: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ProjectModel: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SkillModel: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ExperienceModel: any

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  process.env.JWT_SECRET = 'test-secret'
  process.env.JWT_EXPIRES_IN = '1h'
  process.env.CLIENT_URL = 'http://localhost:5173'
  process.env.COOKIE_SECURE = 'false'
  process.env.NODE_ENV = 'test'
  process.env.ADMIN_EMAIL = 'admin@example.com'
  process.env.ADMIN_PASSWORD = 'seed-test-password'

  const { connectToDatabase } = await import('../src/db/connect.js')
  ;({ seed } = await import('../scripts/seed.js'))
  ;({ UserModel } = await import('../src/models/User.js'))
  ;({ ProfileModel } = await import('../src/models/Profile.js'))
  ;({ ProjectModel } = await import('../src/models/Project.js'))
  ;({ SkillModel } = await import('../src/models/Skill.js'))
  ;({ ExperienceModel } = await import('../src/models/Experience.js'))

  await connectToDatabase()
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

describe('seed script', () => {
  it('populates the admin user, profile, Voyager, skills, and experience from the static data', async () => {
    await seed()

    const users = await UserModel.find()
    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('admin@example.com')

    const profile = await ProfileModel.findOne()
    expect(profile?.name).toBe('Vijaya Bharathi')
    expect(profile?.introduction).toContain('scalable APIs')

    const voyager = await ProjectModel.findOne({ slug: 'voyager' })
    expect(voyager?.title).toBe('Voyager')
    expect(voyager?.technologies).toEqual(
      expect.arrayContaining(['.NET', 'ASP.NET Core', 'Azure', 'Microservices']),
    )

    const skills = await SkillModel.find()
    expect(skills.length).toBeGreaterThan(20)

    const experience = await ExperienceModel.find()
    expect(experience).toHaveLength(1)
    expect(experience[0].role).toBe('.NET Developer')
    expect(experience[0].current).toBe(true)
  })

  it('is idempotent: running it twice does not create duplicates', async () => {
    await seed()
    await seed()

    expect(await UserModel.countDocuments()).toBe(1)
    expect(await ProfileModel.countDocuments()).toBe(1)
    expect(await ProjectModel.countDocuments({ slug: 'voyager' })).toBe(1)
    expect(await ExperienceModel.countDocuments()).toBe(1)

    const skillCountAfterFirstSeed = await SkillModel.countDocuments()
    await seed()
    expect(await SkillModel.countDocuments()).toBe(skillCountAfterFirstSeed)
  })
})
