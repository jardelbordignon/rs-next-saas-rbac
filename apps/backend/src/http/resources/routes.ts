import { createAccountController } from './account/create/create-account.controller'
import type { FastifyInstance } from 'fastify'

export function routes(app: FastifyInstance) {
  app.register(createAccountController)
}
