import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { projectsApi } from '../../../services/projectsApi'
import { ApiRequestError } from '../../../services/api'
import type { ProjectInput } from '../../../types/cms'
import { ListField, NumberField, TextAreaField, TextField } from '../../components/FormField'
import { Toggle } from '../../components/Toggle'

const EMPTY_PROJECT: ProjectInput = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  technologies: [],
  githubUrl: '',
  liveUrl: '',
  imageUrl: '',
  featured: false,
  displayOrder: 0,
  published: false,
  problem: '',
  solution: '',
  architecture: '',
  keyFeatures: [],
  challenges: '',
  technicalDecisions: '',
  whatILearned: '',
}

export function ProjectForm() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [values, setValues] = useState<ProjectInput>(EMPTY_PROJECT)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    projectsApi
      .adminList()
      .then((projects) => {
        const project = projects.find((p) => p._id === id)
        if (project) {
          const { _id: _unused, ...rest } = project
          setValues(rest)
        }
      })
      .finally(() => setIsLoading(false))
  }, [id])

  const update = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError(null)
    setFieldErrors({})

    const errors: Record<string, string> = {}
    if (!values.title.trim()) errors.title = 'Title is required'
    if (!values.slug.trim()) errors.slug = 'Slug is required'
    if (!values.description.trim()) errors.description = 'Description is required'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await projectsApi.update(id, values)
      } else {
        await projectsApi.create(values)
      }
      navigate('/admin/projects')
    } catch (error) {
      if (error instanceof ApiRequestError && error.errors) {
        setFieldErrors(
          Object.fromEntries(error.errors.map((e) => [e.field, e.message])),
        )
      }
      setFormError(
        error instanceof ApiRequestError ? error.message : 'Unable to save project.',
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
        {isEditing ? 'Edit Project' : 'Add Project'}
      </h1>

      <form className="mt-6 max-w-2xl space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          id="title"
          label="Title"
          required
          value={values.title}
          onChange={(v) => update('title', v)}
        />
        {fieldErrors.title && <FieldError message={fieldErrors.title} />}

        <TextField
          id="slug"
          label="Slug"
          required
          value={values.slug}
          onChange={(v) => update('slug', v)}
        />
        {fieldErrors.slug && <FieldError message={fieldErrors.slug} />}

        <TextField
          id="shortDescription"
          label="Short Description"
          value={values.shortDescription}
          onChange={(v) => update('shortDescription', v)}
        />

        <TextAreaField
          id="description"
          label="Description"
          required
          value={values.description}
          onChange={(v) => update('description', v)}
        />
        {fieldErrors.description && <FieldError message={fieldErrors.description} />}

        <ListField
          id="technologies"
          label="Technologies"
          value={values.technologies}
          onChange={(v) => update('technologies', v)}
          helpText="Comma-separated list"
        />

        <TextField
          id="githubUrl"
          label="GitHub URL"
          value={values.githubUrl}
          onChange={(v) => update('githubUrl', v)}
        />
        {fieldErrors.githubUrl && <FieldError message={fieldErrors.githubUrl} />}

        <TextField
          id="liveUrl"
          label="Live Demo URL"
          value={values.liveUrl}
          onChange={(v) => update('liveUrl', v)}
        />
        {fieldErrors.liveUrl && <FieldError message={fieldErrors.liveUrl} />}

        <TextField
          id="imageUrl"
          label="Image URL"
          value={values.imageUrl}
          onChange={(v) => update('imageUrl', v)}
        />
        {fieldErrors.imageUrl && <FieldError message={fieldErrors.imageUrl} />}

        <NumberField
          id="displayOrder"
          label="Display Order"
          value={values.displayOrder}
          onChange={(v) => update('displayOrder', v)}
        />

        <div className="flex gap-6">
          <Toggle
            label="Featured"
            checked={values.featured}
            onChange={(v) => update('featured', v)}
          />
          <Toggle
            label="Published"
            checked={values.published}
            onChange={(v) => update('published', v)}
          />
        </div>

        <fieldset className="space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <legend className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Project Details Page Content
          </legend>

          <TextAreaField
            id="problem"
            label="Problem"
            value={values.problem}
            onChange={(v) => update('problem', v)}
          />
          <TextAreaField
            id="solution"
            label="Solution"
            value={values.solution}
            onChange={(v) => update('solution', v)}
          />
          <TextAreaField
            id="architecture"
            label="Architecture"
            value={values.architecture}
            onChange={(v) => update('architecture', v)}
          />
          <ListField
            id="keyFeatures"
            label="Key Features"
            value={values.keyFeatures}
            onChange={(v) => update('keyFeatures', v)}
            helpText="Comma-separated list"
          />
          <TextAreaField
            id="challenges"
            label="Challenges"
            value={values.challenges}
            onChange={(v) => update('challenges', v)}
          />
          <TextAreaField
            id="technicalDecisions"
            label="Technical Decisions"
            value={values.technicalDecisions}
            onChange={(v) => update('technicalDecisions', v)}
          />
          <TextAreaField
            id="whatILearned"
            label="What I Learned"
            value={values.whatILearned}
            onChange={(v) => update('whatILearned', v)}
          />
        </fieldset>

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
            onClick={() => navigate('/admin/projects')}
            className="rounded-full border border-slate-300 px-5 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function FieldError({ message }: { message: string }) {
  return <p className="-mt-3 text-xs text-red-600 dark:text-red-400">{message}</p>
}
