export class NotFoundError extends Error {
  status: number

  constructor(message = 'Not Found') {
    super(message)
    this.status = 404
  }
}
