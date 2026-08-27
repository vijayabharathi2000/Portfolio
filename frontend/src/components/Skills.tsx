import { useApiResource } from '../hooks/useApiResource'
import { skillsApi } from '../services/skillsApi'
import { AsyncStateMessage } from './AsyncStateMessage'
import { FadeIn } from './FadeIn'

function groupByCategory(skills: { category: string; name: string }[]) {
  const groups = new Map<string, string[]>()

  for (const skill of skills) {
    const existing = groups.get(skill.category)

    if (existing) {
      existing.push(skill.name)
    } else {
      groups.set(skill.category, [skill.name])
    }
  }

  return Array.from(groups.entries()).map(([category, names]) => ({
    category,
    skills: names,
  }))
}

export function Skills() {
  const state = useApiResource(skillsApi.list, [])

  return (
    <div className="w-full">

      <FadeIn>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Skills
        </h2>
      </FadeIn>

      {state.status === 'loading' && (
        <div className="mt-4">
          <AsyncStateMessage text="Loading skills..." />
        </div>
      )}

      {state.status === 'error' && (
        <div className="mt-4">
          <AsyncStateMessage text="Unable to load skills." />
        </div>
      )}

      {state.status === 'success' && state.data.length === 0 && (
        <div className="mt-4">
          <AsyncStateMessage text="No skills available." />
        </div>
      )}

      {state.status === 'success' && state.data.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">

          {groupByCategory(state.data).map((group) => (
            <FadeIn
              key={group.category}
              hover
              className="rounded-card border border-slate-200 bg-white p-3 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {group.category}
              </h3>

              <ul className="mt-2 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}

        </div>
      )}
    </div>
  )
}