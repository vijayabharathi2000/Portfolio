export interface FieldError {
  field: string
  message: string
}

export class ApiError extends Error {
  statusCode: number
  errors?: FieldError[]

  constructor(statusCode: number, message: string, errors?: FieldError[]) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }

  static badRequest(message: string, errors?: FieldError[]) {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message)
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message)
  }

  static conflict(message: string, errors?: FieldError[]) {
    return new ApiError(409, message, errors)
  }
}
