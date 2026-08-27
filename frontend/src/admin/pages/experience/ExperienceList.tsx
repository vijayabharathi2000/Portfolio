import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { experienceApi } from '../../../services/experienceApi'
import type { Experience } from '../../../types/cms'
import { Toggle } from '../../components/Toggle'

export function ExperienceList() {
  const [entries, setEntries] = useState<Experience[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    experienceApi
      .adminList()
      .then(setEntries)
      .catch(() => setError('Unable to load experience.'))
  }, [])

  const handleVisibilityToggle = async (entry: Experience) => {
    const updated = await experienceApi.update(entry._id, { visible: !entry.visible })
    setEntries((current) =>
      current ? current.map((e) => (e._id === updated._id ? updated : e)) : current,
    )
  }

  const handleDisplayOrderChange = async (entry: Experience, displayOrder: number) => {
    const updated = await experienceApi.update(entry._id, { displayOrder })
    setEntries((current) =>
      current
        ? current
            .map((e) => (e._id === updated._id ? updated : e))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        : current,
    )
  }

  const handleDelete = async (entry: Experience) => {
    if (!window.confirm(`Delete experience entry "${entry.role} at ${entry.company}"?`)) {
      return
    }
    await experienceApi.remove(entry._id)
    setEntries((current) => current?.filter((e) => e._id !== entry._id) ?? current)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Experience
        </h1>
        <Link
          to="/admin/experience/new"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Add Experience
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {entries && entries.length === 0 && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          No experience entries yet.
        </p>
      )}

      {entries && entries.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-card border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-medium tracking-wide text-slate-500 uppercase dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {entries.map((entry) => (
                <tr key={entry._id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">
                    {entry.role}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {entry.company}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={entry.displayOrder}
                      onChange={(event) =>
                        handleDisplayOrderChange(entry, Number(event.target.value))
                      }
                      className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      label=""
                      checked={entry.visible}
                      onChange={() => handleVisibilityToggle(entry)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/experience/${entry._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry)}
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
