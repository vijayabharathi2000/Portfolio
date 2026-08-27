import { ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useApiResource } from '../hooks/useApiResource'
import { projectsApi } from '../services/projectsApi'
import { ApiRequestError } from '../services/api'
import { AsyncStateMessage } from '../components/AsyncStateMessage'

function DetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        {title}
      </h2>
      <div className="mt-2 text-slate-600 dark:text-slate-300">{children}</div>
    </section>
  )
}

function NotFoundMessage({ slug }: { slug: string | undefined }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
        Project not found
      </h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        We couldn&apos;t find a project matching &ldquo;{slug}&rdquo;.
      </p>
      <Link
        to="/#projects"
        className="mt-6 inline-block text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        Back to Projects
      </Link>
    </div>
  )
}

export function ProjectDetails() {
  const { slug } = useParams<{ slug: string }>()
  const state = useApiResource(
    () => projectsApi.getBySlug(slug ?? ''),
    [slug],
  )

  if (state.status === 'loading') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <AsyncStateMessage text="Loading project..." />
      </div>
    )
  }

  if (state.status === 'error') {
    if (state.error instanceof ApiRequestError && state.error.status !== 404) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <AsyncStateMessage text="Unable to load this project. Please try again later." />
        </div>
      )
    }
    return <NotFoundMessage slug={slug} />
  }

  const project = state.data

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-xs font-medium tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
        Featured Project
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl dark:text-slate-50">
        {project.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            GitHub
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Live Demo
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>

      <DetailSection title="Overview">
        <p>{project.description}</p>
      </DetailSection>

      <DetailSection title="Problem">
        <p>{project.problem}</p>
      </DetailSection>

      <DetailSection title="Solution">
        <p>{project.solution}</p>
      </DetailSection>

      <DetailSection title="Architecture">
        <p>{project.architecture}</p>
      </DetailSection>

      <DetailSection title="Technology Stack">
        <ul className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tech}
            </li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Key Features">
        <ul className="list-disc space-y-1 pl-5">
          {project.keyFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </DetailSection>

      <DetailSection title="Challenges">
        <p>{project.challenges}</p>
      </DetailSection>

      <DetailSection title="Technical Decisions">
        <p>{project.technicalDecisions}</p>
      </DetailSection>

      <DetailSection title="What I Learned">
        <p>{project.whatILearned}</p>
      </DetailSection>

      <Link
        to="/#projects"
        className="mt-10 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        ← Back to Projects
      </Link>
    </article>
  )
}
