import { authByCredentialsController } from './users/auth-by-credentials/auth-by-credentials.controller'
import { createUserController } from './users/create/create-user.controller'
import type { FastifyInstance } from 'fastify'

export function routes(app: FastifyInstance) {
  app.register(createUserController)
  app.register(authByCredentialsController)
}
