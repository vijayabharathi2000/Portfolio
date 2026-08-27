import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { skillsApi } from '../../../services/skillsApi'
import { ApiRequestError } from '../../../services/api'
import type { SkillInput } from '../../../types/cms'
import { NumberField, TextField } from '../../components/FormField'
import { Toggle } from '../../components/Toggle'

const EMPTY_SKILL: SkillInput = {
  name: '',
  category: '',
  icon: '',
  displayOrder: 0,
  visible: true,
}

export function SkillForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [values, setValues] = useState<SkillInput>(EMPTY_SKILL)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    skillsApi
      .adminList()
      .then((skills) => {
        const skill = skills.find((s) => s._id === id)
        if (skill) {
          const { _id: _unused, ...rest } = skill
          setValues(rest)
        }
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const update = <K extends keyof SkillInput>(key: K, value: SkillInput[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const errors: Record<string, string> = {}
    if (!values.name.trim()) errors.name = 'Name is required'
    if (!values.category.trim()) errors.category = 'Category is required'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await skillsApi.update(id, values)
      } else {
        await skillsApi.create(values)
      }
      navigate('/admin/skills')
    } catch (error) {
      setFormError(
        error instanceof ApiRequestError ? error.message : 'Unable to save skill.',
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
        {isEditing ? 'Edit Skill' : 'Add Skill'}
      </h1>

      <form className="mt-6 max-w-md space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          id="name"
          label="Name"
          required
          value={values.name}
          onChange={(v) => update('name', v)}
        />
        {fieldErrors.name && <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>}

        <TextField
          id="category"
          label="Category"
          required
          value={values.category}
          onChange={(v) => update('category', v)}
        />
        {fieldErrors.category && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.category}</p>
        )}

        <TextField
          id="icon"
          label="Icon"
          value={values.icon}
          onChange={(v) => update('icon', v)}
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
            onClick={() => navigate('/admin/skills')}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
