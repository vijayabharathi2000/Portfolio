import { ExternalLink } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'

export function Footer() {
  const state = useProfile()
  const year = new Date().getFullYear()
  const name = state.status === 'success' ? state.data.name : ''

  return (
    <footer className="border-t border-slate-200 py-4 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-sm text-slate-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8 dark:text-slate-400">
        <p>
          © {year} {name}. Built with React + TypeScript.
        </p>

        {state.status === 'success' && (
          <div className="flex items-center gap-4">
            <a
              href={state.data.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
            >
              GitHub
              <ExternalLink size={14} aria-hidden="true" />
            </a>

            <a
              href={state.data.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
            >
              LinkedIn
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </footer>
  )
}