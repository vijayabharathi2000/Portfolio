import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { projectsApi } from '../../services/projectsApi'
import { skillsApi } from '../../services/skillsApi'
import { experienceApi } from '../../services/experienceApi'
import { certificationsApi } from '../../services/certificationsApi'

interface Counts {
  projects: number
  skills: number
  experience: number
  certifications: number
}

const QUICK_ACTIONS = [
  { to: '/admin/projects/new', label: 'Add Project' },
  { to: '/admin/skills/new', label: 'Add Skill' },
  { to: '/admin/experience/new', label: 'Add Experience' },
  { to: '/admin/certifications/new', label: 'Add Certification' },
]

export function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      projectsApi.adminList(),
      skillsApi.adminList(),
      experienceApi.adminList(),
      certificationsApi.adminList(),
    ])
      .then(([projects, skills, experience, certifications]) => {
        if (cancelled) return
        setCounts({
          projects: projects.length,
          skills: skills.length,
          experience: experience.length,
          certifications: certifications.length,
        })
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load dashboard counts.')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const cards = [
    { label: 'Projects', value: counts?.projects },
    { label: 'Skills', value: counts?.skills },
    { label: 'Experience', value: counts?.experience },
    { label: 'Certifications', value: counts?.certifications },
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
        Dashboard
      </h1>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-card border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-50">
              {card.value ?? '—'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
          Quick Actions
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
