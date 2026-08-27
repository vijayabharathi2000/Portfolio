import { ExternalLink, Mail } from 'lucide-react'
import { useProfile } from '../hooks/useProfile'
import { AsyncStateMessage } from './AsyncStateMessage'
import { FadeIn } from './FadeIn'

export function Contact() {
  const state = useProfile()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <FadeIn>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Let&apos;s Connect
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-600 dark:text-slate-300">
          I&apos;m open to discussing software engineering opportunities,
          interesting projects and technology.
        </p>

        {state.status === 'loading' && (
          <div className="mt-8">
            <AsyncStateMessage text="Loading contact details..." />
          </div>
        )}
        {state.status === 'error' && (
          <div className="mt-8">
            <AsyncStateMessage text="Unable to load contact details." />
          </div>
        )}
        {state.status === 'success' && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <a
              href={`mailto:${state.data.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-white transition-colors hover:bg-indigo-500"
            >
              <Mail size={16} aria-hidden="true" />
              Email
            </a>
            <a
              href={state.data.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              LinkedIn
              <ExternalLink size={14} aria-hidden="true" />
            </a>
            <a
              href={state.data.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              GitHub
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        )}
      </FadeIn>
    </div>
  )
}
