import { useApiResource } from '../hooks/useApiResource'
import { certificationsApi } from '../services/certificationsApi'
import { AsyncStateMessage } from './AsyncStateMessage'
import { FadeIn } from './FadeIn'

export function Certifications() {
  const state = useApiResource(certificationsApi.list, [])

  return (
    <div className="w-full">
      <FadeIn>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Certifications
        </h2>
      </FadeIn>

      {state.status === 'loading' && (
        <div className="mt-6">
          <AsyncStateMessage text="Loading certifications..." />
        </div>
      )}

      {state.status === 'error' && (
        <div className="mt-6">
          <AsyncStateMessage text="Unable to load certifications." />
        </div>
      )}

      {state.status === 'success' && state.data.length === 0 && (
        <div className="mt-6">
          <AsyncStateMessage text="No certifications available." />
        </div>
      )}

      {state.status === 'success' && state.data.length > 0 && (
        <div className="mt-4 space-y-3">
          {state.data.map((cert) => (
            <FadeIn
              key={cert._id}
              hover
              className="w-full rounded-card border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-semibold leading-5 text-slate-900 dark:text-slate-50">
                {cert.name}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {cert.issuer}
                {cert.issueDate ? ` · ${cert.issueDate}` : ''}
              </p>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}