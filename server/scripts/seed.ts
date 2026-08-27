/**
 * Development-safe seed/migration script.
 *
 * Upserts the single admin user (from ADMIN_EMAIL/ADMIN_PASSWORD env vars),
 * the profile, the Voyager project, and the existing skills/experience
 * entries, using only the values already present in the client's
 * src/data/*.ts files as of this change. Certifications are not seeded
 * because src/data/certifications.ts is currently empty — no certification
 * has been added yet.
 *
 * Safe to re-run: every write is an upsert keyed on a natural unique field
 * (email, slug, profile singleton, name+category, company+role), so running
 * this script twice never creates duplicates and never touches unrelated
 * documents.
 *
 * The frontend's Profile section (Hero + About) uses two distinct pieces of
 * copy — a short "introduction" shown in the Hero and a longer "aboutText"
 * shown in About. The plan's Profile field list only has headline/summary,
 * so this project's Profile model adds an extra `introduction` field to
 * preserve both pieces of existing copy without dropping or merging content
 * (see design.md).
 */
import { pathToFileURL } from 'node:url'
import { connectToDatabase, disconnectFromDatabase } from '../src/db/connect.js'
import { UserModel } from '../src/models/User.js'
import { ProfileModel } from '../src/models/Profile.js'
import { ProjectModel } from '../src/models/Project.js'
import { SkillModel } from '../src/models/Skill.js'
import { ExperienceModel } from '../src/models/Experience.js'
import { hashPassword } from '../src/utils/password.js'
import { logger } from '../src/utils/logger.js'

// Verbatim from client/src/data/profile.ts
const PROFILE = {
  name: 'Vijaya Bharathi',
  headline: '.NET Developer | Backend Engineer | Cloud & AI Enthusiast',
  introduction:
    'I build scalable APIs, microservices and cloud-native applications using .NET, Azure and modern technologies.',
  summary:
    'I am a .NET developer focused on building scalable backend services, REST APIs and microservices. My experience includes working with ASP.NET Core, Azure, distributed systems, databases and cloud-native technologies. I am also exploring React and AI-powered application development to build modern full-stack solutions.',
  email: '[add contact email]',
  phone: '',
  location: '',
  githubUrl: '[add GitHub profile URL]',
  linkedinUrl: 'www.linkedin.com/in/bharathimarimuthu',
  resumeUrl: '/resume.pdf',
  profileImageUrl: '',
}

// Verbatim from client/src/data/projects.ts
const VOYAGER = {
  title: 'Voyager',
  slug: 'voyager',
  shortDescription: '[Add a one-sentence project description]',
  description: '[Add a full project overview]',
  technologies: ['.NET', 'ASP.NET Core', 'Azure', 'Microservices'],
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  featured: true,
  displayOrder: 1,
  published: true,
  problem: '[Add the problem this project solves]',
  solution: '[Add how the project solves it]',
  architecture: '[Add an architecture overview]',
  keyFeatures: ['[Add a key feature]'],
  challenges: '[Add notable challenges encountered]',
  technicalDecisions: '[Add notable technical decisions and rationale]',
  whatILearned: '[Add what was learned building this project]',
}

// Verbatim from client/src/data/skills.ts, flattened with a sequential
// displayOrder that preserves the original category grouping order.
const SKILL_CATEGORIES: { category: string; skills: string[] }[] = [
  {
    category: 'Backend',
    skills: ['C#', '.NET', 'ASP.NET Core', 'Web API', 'REST APIs', 'Microservices', 'LINQ'],
  },
  {
    category: 'Frontend',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
  },
  {
    category: 'Cloud & Infrastructure',
    skills: [
      'Azure',
      'Azure Functions',
      'Azure API Management',
      'Azure Kubernetes Service',
      'Azure Event Hub',
      'Kubernetes',
    ],
  },
  {
    category: 'Databases & Caching',
    skills: ['SQL Server', 'Azure Cosmos DB', 'Redis'],
  },
  {
    category: 'Observability & Tools',
    skills: ['Application Insights', 'Datadog', 'Git', 'GitHub', 'GitHub Copilot', 'Docker'],
  },
]

// Verbatim from client/src/data/experience.ts. The static endDate value of
// "Present" is represented as current: true / endDate: '' in the CMS model.
const EXPERIENCE = {
  company: '[Add company name]',
  role: '.NET Developer',
  location: '',
  startDate: '[Add start date]',
  endDate: '',
  current: true,
  description: '',
  responsibilities: [
    '[Add a real responsibility, e.g. Developed REST APIs using ASP.NET Core]',
    '[Add a real responsibility]',
  ],
  technologies: [],
  displayOrder: 0,
  visible: true,
}

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be set (see server/.env.example) before seeding',
    )
  }

  const passwordHash = await hashPassword(password)
  await UserModel.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $set: { passwordHash, role: 'admin' } },
    { upsert: true, setDefaultsOnInsert: true },
  )
  logger.info(`Upserted admin user: ${email}`)
}

async function seedProfile() {
  await ProfileModel.findOneAndUpdate(
    {},
    { $set: PROFILE },
    { upsert: true, setDefaultsOnInsert: true },
  )
  logger.info('Upserted profile')
}

async function seedVoyager() {
  await ProjectModel.findOneAndUpdate(
    { slug: VOYAGER.slug },
    { $set: VOYAGER },
    { upsert: true, setDefaultsOnInsert: true },
  )
  logger.info('Upserted Voyager project')
}

async function seedSkills() {
  let displayOrder = 0
  for (const group of SKILL_CATEGORIES) {
    for (const name of group.skills) {
      await SkillModel.findOneAndUpdate(
        { name, category: group.category },
        { $set: { icon: '', displayOrder, visible: true } },
        { upsert: true, setDefaultsOnInsert: true },
      )
      displayOrder += 1
    }
  }
  logger.info(`Upserted ${displayOrder} skills`)
}

async function seedExperience() {
  await ExperienceModel.findOneAndUpdate(
    { company: EXPERIENCE.company, role: EXPERIENCE.role },
    { $set: EXPERIENCE },
    { upsert: true, setDefaultsOnInsert: true },
  )
  logger.info('Upserted experience entry')
}

export async function seed() {
  await seedAdminUser()
  await seedProfile()
  await seedVoyager()
  await seedSkills()
  await seedExperience()
  logger.info('Seed complete')
}

const isMainModule =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href

if (isMainModule) {
  connectToDatabase()
    .then(seed)
    .then(disconnectFromDatabase)
    .catch((error) => {
      logger.error('Seed failed', error)
      process.exit(1)
    })
}
