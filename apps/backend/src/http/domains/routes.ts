import { authByCredentialsController } from './users/auth-by-credentials/auth-by-credentials.controller'
import { authByGithubController } from './users/auth-by-github/auth-by-github.controller'
import { createUserController } from './users/create/create-user.controller'
import { getProfileController } from './users/get-profile/get-profile.controller'
import { requestPasswordRecoverController } from './users/request-password-recover/request-password-recover.controller'
import { requestPasswordResetController } from './users/request-password-reset/request-password-reset.controller'
import type { FastifyInstance } from 'fastify'

export function routes(app: FastifyInstance) {
  app.register(createUserController)
  app.register(authByCredentialsController)
  app.register(getProfileController)
  app.register(requestPasswordRecoverController)
  app.register(requestPasswordResetController)
  app.register(authByGithubController)
}
