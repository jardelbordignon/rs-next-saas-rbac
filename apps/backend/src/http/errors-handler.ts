import { ZodError } from 'zod'
import { env } from '@/env'
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from './errors'
import type { FastifyInstance } from 'fastify'

export const errorsHandler: FastifyInstance['errorHandler'] = (error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      errors: error.flatten().fieldErrors,
    })
  }

  if (
    error instanceof BadRequestError ||
    error instanceof ConflictError ||
    error instanceof NotFoundError ||
    error instanceof UnauthorizedError
  ) {
    return reply.status(error.status).send({ message: error.message })
  }

  console.error(error)

  const message =
    env.NODE_ENV !== 'production' ? error.message : 'Internal Server Error'

  return reply.status(500).send({ message })
}
