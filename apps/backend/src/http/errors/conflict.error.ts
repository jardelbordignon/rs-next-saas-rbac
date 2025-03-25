export class ConflictError extends Error {
  status: number

  constructor(message = 'Conflict') {
    super(message)
    this.status = 409
  }
}
