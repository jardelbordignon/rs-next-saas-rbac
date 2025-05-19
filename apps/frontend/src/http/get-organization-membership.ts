import { api } from './api-client'
import type { Role } from '@repo/authorizations/src/roles'

interface GetOrganizationMembershipResponse {
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
}

export async function getOrganizationMembership(slug: string) {
  return api
    .get(`organizations/${slug}/membership`)
    .json<GetOrganizationMembershipResponse>()
}
