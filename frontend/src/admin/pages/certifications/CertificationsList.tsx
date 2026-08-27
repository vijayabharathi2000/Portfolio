import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { certificationsApi } from '../../../services/certificationsApi'
import type { Certification } from '../../../types/cms'
import { Toggle } from '../../components/Toggle'

export function CertificationsList() {
  const [certifications, setCertifications] = useState<Certification[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    certificationsApi
      .adminList()
      .then(setCertifications)
      .catch(() => setError('Unable to load certifications.'))
  }, [])

  const handleVisibilityToggle = async (certification: Certification) => {
    const updated = await certificationsApi.update(certification._id, {
      visible: !certification.visible,
    })
    setCertifications((current) =>
      current ? current.map((c) => (c._id === updated._id ? updated : c)) : current,
    )
  }

  const handleDisplayOrderChange = async (
    certification: Certification,
    displayOrder: number,
  ) => {
    const updated = await certificationsApi.update(certification._id, { displayOrder })
    setCertifications((current) =>
      current
        ? current
            .map((c) => (c._id === updated._id ? updated : c))
            .sort((a, b) => a.displayOrder - b.displayOrder)
        : current,
    )
  }

  const handleDelete = async (certification: Certification) => {
    if (!window.confirm(`Delete certification "${certification.name}"?`)) return
    await certificationsApi.remove(certification._id)
    setCertifications((current) =>
      current?.filter((c) => c._id !== certification._id) ?? current,
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Certifications
        </h1>
        <Link
          to="/admin/certifications/new"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Add Certification
        </Link>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {certifications && certifications.length === 0 && (
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          No certifications yet.
        </p>
      )}

      {certifications && certifications.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-card border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-medium tracking-wide text-slate-500 uppercase dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Issuer</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
              {certifications.map((certification) => (
                <tr key={certification._id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">
                    {certification.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {certification.issuer}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={certification.displayOrder}
                      onChange={(event) =>
                        handleDisplayOrderChange(certification, Number(event.target.value))
                      }
                      className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      label=""
                      checked={certification.visible}
                      onChange={() => handleVisibilityToggle(certification)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/certifications/${certification._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(certification)}
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
