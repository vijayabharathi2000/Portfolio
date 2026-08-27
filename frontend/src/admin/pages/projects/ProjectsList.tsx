import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { projectsApi } from '../../../services/projectsApi'
import type { Project } from '../../../types/cms'
import { Toggle } from '../../components/Toggle'

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    projectsApi
      .adminList()
      .then(setProjects)
      .catch(() => setError('Unable to load projects.'))
  }

  useEffect(load, [])

  const handleToggle = async (project: Project, field: 'featured' | 'published') => {
    const updated = await projectsApi.update(project._id, { [field]: !project[field] })
    setProjects((current) =>
      current ? current.map((p) => (p._id === updated._id ? updated : p)) : current,
    )
  }

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete project "${project.title}"? This cannot be undone.`)) {
      return
    }
    await projectsApi.remove(project._id)
    setProjects((current) => current?.filter((p) => p._id !== project._id) ?? current)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Projects
        </h1>
        <Link
          to="/admin/projects/new"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Add Project
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {projects && projects.length === 0 && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          No projects yet.
        </p>
      )}

      {projects && projects.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-card border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-medium tracking-wide text-slate-500 uppercase dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {projects.map((project) => (
                <tr key={project._id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">
                    {project.title}
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      label=""
                      checked={project.featured}
                      onChange={() => handleToggle(project, 'featured')}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      label=""
                      checked={project.published}
                      onChange={() => handleToggle(project, 'published')}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/projects/${project._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        className="text-red-600 hover:text-red-500 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
