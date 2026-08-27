import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { skillsApi } from '../../../services/skillsApi'
import type { Skill } from '../../../types/cms'
import { Toggle } from '../../components/Toggle'

export function SkillsList() {
  const [skills, setSkills] = useState<Skill[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    skillsApi
      .adminList()
      .then(setSkills)
      .catch(() => setError('Unable to load skills.'))
  }, [])

  const handleVisibilityToggle = async (skill: Skill) => {
    const updated = await skillsApi.update(skill._id, { visible: !skill.visible })
    setSkills((current) =>
      current ? current.map((s) => (s._id === updated._id ? updated : s)) : current,
    )
  }

  const handleDisplayOrderChange = async (skill: Skill, displayOrder: number) => {
    const updated = await skillsApi.update(skill._id, { displayOrder })
    setSkills((current) =>
      current
        ? current
            .map((s) => (s._id === updated._id ? updated : s))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        : current,
    )
  }

  const handleDelete = async (skill: Skill) => {
    if (!window.confirm(`Delete skill "${skill.name}"?`)) return
    await skillsApi.remove(skill._id)
    setSkills((current) => current?.filter((s) => s._id !== skill._id) ?? current)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Skills</h1>
        <Link
          to="/admin/skills/new"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Add Skill
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {skills && skills.length === 0 && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">No skills yet.</p>
      )}

      {skills && skills.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-card border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-medium tracking-wide text-slate-500 uppercase dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {skills.map((skill) => (
                <tr key={skill._id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">
                    {skill.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {skill.category}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={skill.displayOrder}
                      onChange={(event) =>
                        handleDisplayOrderChange(skill, Number(event.target.value))
                      }
                      className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      label=""
                      checked={skill.visible}
                      onChange={() => handleVisibilityToggle(skill)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/skills/${skill._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(skill)}
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
