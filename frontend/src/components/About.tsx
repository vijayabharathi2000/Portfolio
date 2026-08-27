import { useProfile } from '../hooks/useProfile'
import { AsyncStateMessage } from './AsyncStateMessage'
import { FadeIn } from './FadeIn'

export function About() {
  const state = useProfile()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h2 className="text-2xl font-semibold sm:text-3xl">About Me</h2>
        {state.status === 'loading' && (
          <div className="mt-4">
            <AsyncStateMessage text="Loading..." />
          </div>
        )}
        {state.status === 'error' && (
          <div className="mt-4">
            <AsyncStateMessage text="Unable to load profile." />
          </div>
        )}
        {state.status === 'success' && (
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            {state.data.summary}
          </p>
        )}
      </FadeIn>
    </div>
  )
}
