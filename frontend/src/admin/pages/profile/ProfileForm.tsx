import { useEffect, useState, type FormEvent } from 'react'
import { profileApi } from '../../../services/profileApi'
import { ApiRequestError } from '../../../services/api'
import type { Profile } from '../../../types/cms'
import { TextAreaField, TextField } from '../../components/FormField'

const EMPTY_PROFILE: Profile = {
  name: '',
  headline: '',
  introduction: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  githubUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
  profileImageUrl: '',
}

export function ProfileForm() {
  const [values, setValues] = useState<Profile>(EMPTY_PROFILE)
  const [isLoading, setIsLoading] = useState(true)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    profileApi
      .adminGet()
      .then(setValues)
      .catch(() => {
        // No profile document yet; keep the empty defaults so the admin can create one.
      })
      .finally(() => setIsLoading(false))
  }, [])

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setSuccessMessage(null)
    setIsSubmitting(true)
    try {
      const updated = await profileApi.update(values)
      setValues(updated)
      setSuccessMessage('Profile saved.')
    } catch (error) {
      setFormError(
        error instanceof ApiRequestError ? error.message : 'Unable to save profile.',
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
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Profile</h1>

      <form className="mt-6 max-w-2xl space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          id="name"
          label="Name"
          required
          value={values.name}
          onChange={(v) => update('name', v)}
        />
        <TextField
          id="headline"
          label="Headline"
          value={values.headline}
          onChange={(v) => update('headline', v)}
        />
        <TextAreaField
          id="introduction"
          label="Introduction"
          value={values.introduction}
          onChange={(v) => update('introduction', v)}
          rows={2}
        />
        <TextAreaField
          id="summary"
          label="Summary"
          value={values.summary}
          onChange={(v) => update('summary', v)}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(v) => update('email', v)}
        />
        <TextField
          id="location"
          label="Location"
          value={values.location}
          onChange={(v) => update('location', v)}
        />
        <TextField
          id="githubUrl"
          label="GitHub"
          value={values.githubUrl}
          onChange={(v) => update('githubUrl', v)}
        />
        <TextField
          id="linkedinUrl"
          label="LinkedIn"
          value={values.linkedinUrl}
          onChange={(v) => update('linkedinUrl', v)}
        />
        <TextField
          id="resumeUrl"
          label="Resume URL"
          value={values.resumeUrl}
          onChange={(v) => update('resumeUrl', v)}
        />
        <TextField
          id="profileImageUrl"
          label="Profile Image URL"
          value={values.profileImageUrl}
          onChange={(v) => update('profileImageUrl', v)}
        />

        {formError && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {formError}
          </p>
        )}
        {successMessage && (
          <p role="status" className="text-sm text-green-600 dark:text-green-400">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}
