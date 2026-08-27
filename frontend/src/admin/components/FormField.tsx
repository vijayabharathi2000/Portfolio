import type { ReactNode } from 'react'

const inputClassName =
  'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100'

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      {children}
    </label>
  )
}

export function TextField({
  id,
  label,
  value,
  onChange,
  required,
  type = 'text',
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required && ' *'}
      </Label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </div>
  )
}

export function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={inputClassName}
      />
    </div>
  )
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  required,
  rows = 4,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  rows?: number
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required && ' *'}
      </Label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </div>
  )
}

export function ListField({
  id,
  label,
  value,
  onChange,
  helpText,
}: {
  id: string
  label: string
  value: string[]
  onChange: (value: string[]) => void
  helpText?: string
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="text"
        value={value.join(', ')}
        onChange={(event) =>
          onChange(
            event.target.value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean),
          )
        }
        className={inputClassName}
      />
      {helpText && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}
    </div>
  )
}
