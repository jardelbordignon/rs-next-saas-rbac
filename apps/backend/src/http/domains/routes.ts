import { createOrganizationController } from './organizations/create/create-organization.controller'
import { getMembershipController } from './organizations/get-membership/get-membership.controller'
import { authByCredentialsController } from './users/auth-by-credentials/auth-by-credentials.controller'
import { authByFacebookController } from './users/auth-by-facebook/auth-by-facebook.controller'
import { authByGithubController } from './users/auth-by-github/auth-by-github.controller'
import { authByGoogleController } from './users/auth-by-google/auth-by-google.controller'
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
  app.register(authByFacebookController)
  app.register(authByGithubController)
  app.register(authByGoogleController)
  app.register(createOrganizationController)
  app.register(getMembershipController)
}
