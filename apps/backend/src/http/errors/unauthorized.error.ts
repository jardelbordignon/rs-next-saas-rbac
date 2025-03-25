export class UnauthorizedError extends Error {
  status: number

  constructor(message = 'Unauthorized') {
    super(message)
    this.status = 401
  }
}
