import { changeOrganizationOwnerController } from './organizations/change-owner/change-organization-owner.controller'
import { createOrganizationController } from './organizations/create/create-organization.controller'
import { deleteOrganizationController } from './organizations/delete/delete-organization.controller'
import { findManyOrganizationController } from './organizations/find-many/find-many-organization.controller'
import { findOneOrganizationController } from './organizations/find-one/find-one-organization.controller'
import { getMembershipController } from './organizations/get-membership/get-membership.controller'
import { updateOrganizationController } from './organizations/update/update-organization.controller'
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
  app.register(findOneOrganizationController)
  app.register(findManyOrganizationController)
  app.register(updateOrganizationController)
  app.register(deleteOrganizationController)
  app.register(changeOrganizationOwnerController)
}
