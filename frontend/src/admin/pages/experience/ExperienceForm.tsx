import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { experienceApi } from '../../../services/experienceApi'
import { ApiRequestError } from '../../../services/api'
import type { ExperienceInput } from '../../../types/cms'
import { ListField, NumberField, TextAreaField, TextField } from '../../components/FormField'
import { Toggle } from '../../components/Toggle'

const EMPTY_EXPERIENCE: ExperienceInput = {
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  responsibilities: [],
  technologies: [],
  displayOrder: 0,
  visible: true,
}

export function ExperienceForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [values, setValues] = useState<ExperienceInput>(EMPTY_EXPERIENCE)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    experienceApi
      .adminList()
      .then((entries) => {
        const entry = entries.find((e) => e._id === id)
        if (entry) {
          const { _id: _unused, ...rest } = entry
          setValues(rest)
        }
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const update = <K extends keyof ExperienceInput>(
    key: K,
    value: ExperienceInput[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const errors: Record<string, string> = {}
    if (!values.company.trim()) errors.company = 'Company is required'
    if (!values.role.trim()) errors.role = 'Role is required'
    if (!values.startDate.trim()) errors.startDate = 'Start date is required'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = { ...values, endDate: values.current ? '' : values.endDate }
      if (isEditing && id) {
        await experienceApi.update(id, payload)
      } else {
        await experienceApi.create(payload)
      }
      navigate('/admin/experience')
    } catch (error) {
      setFormError(
        error instanceof ApiRequestError
          ? error.message
          : 'Unable to save experience entry.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
        {isEditing ? 'Edit Experience' : 'Add Experience'}
      </h1>

      <form className="mt-6 max-w-2xl space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          id="company"
          label="Company"
          required
          value={values.company}
          onChange={(v) => update('company', v)}
        />
        {fieldErrors.company && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.company}</p>
        )}

        <TextField
          id="role"
          label="Role"
          required
          value={values.role}
          onChange={(v) => update('role', v)}
        />
        {fieldErrors.role && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.role}</p>
        )}

        <TextField
          id="location"
          label="Location"
          value={values.location}
          onChange={(v) => update('location', v)}
        />

        <TextField
          id="startDate"
          label="Start Date"
          required
          value={values.startDate}
          onChange={(v) => update('startDate', v)}
        />
        {fieldErrors.startDate && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.startDate}</p>
        )}

        <Toggle
          label="Current"
          checked={values.current}
          onChange={(v) => update('current', v)}
        />

        {!values.current && (
          <TextField
            id="endDate"
            label="End Date"
            value={values.endDate}
            onChange={(v) => update('endDate', v)}
          />
        )}

        <TextAreaField
          id="description"
          label="Description"
          value={values.description}
          onChange={(v) => update('description', v)}
        />

        <ListField
          id="responsibilities"
          label="Responsibilities"
          value={values.responsibilities}
          onChange={(v) => update('responsibilities', v)}
          helpText="Comma-separated list"
        />

        <ListField
          id="technologies"
          label="Technologies"
          value={values.technologies}
          onChange={(v) => update('technologies', v)}
          helpText="Comma-separated list"
        />

        <NumberField
          id="displayOrder"
          label="Display Order"
          value={values.displayOrder}
          onChange={(v) => update('displayOrder', v)}
        />

        <Toggle
          label="Visible"
          checked={values.visible}
          onChange={(v) => update('visible', v)}
        />

        {formError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/experience')}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
