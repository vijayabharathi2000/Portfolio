import { useApiResource } from '../hooks/useApiResource'
import { projectsApi } from '../services/projectsApi'
import { AsyncStateMessage } from './AsyncStateMessage'
import { FadeIn } from './FadeIn'
import { ProjectCard } from './ProjectCard'

export function Projects() {
  const state = useApiResource(projectsApi.list, [])

  return (
    <div className="w-full">
      <FadeIn>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Featured Projects
        </h2>
      </FadeIn>

      <div className="mt-4 space-y-4">
        {state.status === 'loading' && (
          <AsyncStateMessage text="Loading projects..." />
        )}

        {state.status === 'error' && (
          <AsyncStateMessage text="Unable to load projects." />
        )}

        {state.status === 'success' && state.data.length === 0 && (
          <AsyncStateMessage text="No projects available." />
        )}

        {state.status === 'success' &&
          state.data.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}
      </div>
    </div>
  )
}