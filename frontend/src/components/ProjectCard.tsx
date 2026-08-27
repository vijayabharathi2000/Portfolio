import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../types/cms'
import { FadeIn } from './FadeIn'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <FadeIn
      hover
      className="rounded-card border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <p className="text-xs font-medium tracking-wide text-indigo-600 uppercase dark:text-indigo-400">
        Featured Project
      </p>

      <h3 className="mt-1.5 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {project.title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
        {project.shortDescription}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <li
            key={tech}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium">
        <Link
          to={`/projects/${project.slug}`}
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
        >
          View Project
        </Link>

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
    </FadeIn>
  )
}