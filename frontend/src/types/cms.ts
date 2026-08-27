export interface Project {
  _id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  technologies: string[]
  githubUrl: string
  liveUrl: string
  imageUrl: string
  featured: boolean
  displayOrder: number
  published: boolean
  problem: string
  solution: string
  architecture: string
  keyFeatures: string[]
  challenges: string
  technicalDecisions: string
  whatILearned: string
}

export type ProjectInput = Omit<Project, '_id'>

export interface Skill {
  _id: string
  name: string
  category: string
  icon: string
  proficiency?: number
  displayOrder: number
  visible: boolean
}

export type SkillInput = Omit<Skill, '_id'>

export interface Experience {
  _id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  responsibilities: string[]
  technologies: string[]
  displayOrder: number
  visible: boolean
}

export type ExperienceInput = Omit<Experience, '_id'>

export interface Certification {
  _id: string
  name: string
  issuer: string
  issueDate: string
  credentialId: string
  credentialUrl: string
  description: string
  displayOrder: number
  visible: boolean
}

export type CertificationInput = Omit<Certification, '_id'>

export interface Profile {
  name: string
  headline: string
  introduction: string
  summary: string
  email: string
  phone: string
  location: string
  githubUrl: string
  linkedinUrl: string
  resumeUrl: string
  profileImageUrl: string
}

export interface AdminUser {
  id: string
  email: string
  role: string
}
