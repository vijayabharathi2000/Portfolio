import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { certificationsApi } from '../../../services/certificationsApi'
import { ApiRequestError } from '../../../services/api'
import type { CertificationInput } from '../../../types/cms'
import { NumberField, TextAreaField, TextField } from '../../components/FormField'
import { Toggle } from '../../components/Toggle'

const EMPTY_CERTIFICATION: CertificationInput = {
  name: '',
  issuer: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  description: '',
  displayOrder: 0,
  visible: true,
}

export function CertificationForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [values, setValues] = useState<CertificationInput>(EMPTY_CERTIFICATION)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    certificationsApi
      .adminList()
      .then((certifications) => {
        const certification = certifications.find((c) => c._id === id)
        if (certification) {
          const { _id: _unused, ...rest } = certification
          setValues(rest)
        }
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const update = <K extends keyof CertificationInput>(
    key: K,
    value: CertificationInput[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const errors: Record<string, string> = {}
    if (!values.name.trim()) errors.name = 'Name is required'
    if (!values.issuer.trim()) errors.issuer = 'Issuer is required'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await certificationsApi.update(id, values)
      } else {
        await certificationsApi.create(values)
      }
      navigate('/admin/certifications')
    } catch (error) {
      setFormError(
        error instanceof ApiRequestError
          ? error.message
          : 'Unable to save certification.',
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
        {isEditing ? 'Edit Certification' : 'Add Certification'}
      </h1>

      <form className="mt-6 max-w-2xl space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          id="name"
          label="Name"
          required
          value={values.name}
          onChange={(v) => update('name', v)}
        />
        {fieldErrors.name && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.name}</p>
        )}

        <TextField
          id="issuer"
          label="Issuer"
          required
          value={values.issuer}
          onChange={(v) => update('issuer', v)}
        />
        {fieldErrors.issuer && (
          <p className="text-xs text-red-600 dark:text-red-400">{fieldErrors.issuer}</p>
        )}

        <TextField
          id="issueDate"
          label="Issue Date"
          value={values.issueDate}
          onChange={(v) => update('issueDate', v)}
        />

        <TextField
          id="credentialId"
          label="Credential ID"
          value={values.credentialId}
          onChange={(v) => update('credentialId', v)}
        />

        <TextField
          id="credentialUrl"
          label="Credential URL"
          value={values.credentialUrl}
          onChange={(v) => update('credentialUrl', v)}
        />

        <TextAreaField
          id="description"
          label="Description"
          value={values.description}
          onChange={(v) => update('description', v)}
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
            onClick={() => navigate('/admin/certifications')}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
