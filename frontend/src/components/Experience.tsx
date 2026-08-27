import { useApiResource } from '../hooks/useApiResource'
import { experienceApi } from '../services/experienceApi'
import { AsyncStateMessage } from './AsyncStateMessage'
import { FadeIn } from './FadeIn'

export function Experience() {
  const state = useApiResource(experienceApi.list, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <FadeIn>
        <h2 className="text-2xl font-semibold sm:text-3xl">Experience</h2>
      </FadeIn>

      {state.status === 'loading' && (
        <div className="mt-8">
          <AsyncStateMessage text="Loading experience..." />
        </div>
      )}
      {state.status === 'error' && (
        <div className="mt-8">
          <AsyncStateMessage text="Unable to load experience." />
        </div>
      )}
      {state.status === 'success' && state.data.length === 0 && (
        <div className="mt-8">
          <AsyncStateMessage text="No experience available." />
        </div>
      )}

      {state.status === 'success' && state.data.length > 0 && (
        <ol className="mt-8 space-y-6 border-l border-slate-200 pl-6 dark:border-slate-800">
          {state.data.map((entry) => (
            <li key={entry._id} className="relative">
              <FadeIn>
                <span
                  className="absolute top-1.5 -left-[1.65rem] h-3 w-3 rounded-full bg-indigo-600"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  {entry.role}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {entry.company} &middot; {entry.startDate} &ndash;{' '}
                  {entry.current ? 'Present' : entry.endDate}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {entry.responsibilities.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </FadeIn>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
