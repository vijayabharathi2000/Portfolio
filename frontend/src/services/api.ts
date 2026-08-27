export interface FieldError {
  field: string
  message: string
}

export class ApiRequestError extends Error {
  status: number
  errors?: FieldError[]

  constructor(message: string, status: number, errors?: FieldError[]) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.errors = errors
  }
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

type SuccessEnvelope<T> = { success: true; data: T }
type ErrorEnvelope = { success: false; message: string; errors?: FieldError[] }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  let body: SuccessEnvelope<T> | ErrorEnvelope | undefined
  try {
    body = await response.json()
  } catch {
    body = undefined
  }

  if (!response.ok || !body || !body.success) {
    const message =
      body && !body.success ? body.message : `Request failed with status ${response.status}`
    const errors = body && !body.success ? body.errors : undefined
    throw new ApiRequestError(message, response.status, errors)
  }

  return body.data
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, payload?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    }),
  put: <T>(path: string, payload?: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
