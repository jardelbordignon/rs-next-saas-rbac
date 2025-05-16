import { api } from './api-client'
import type { Role } from '@repo/authorizations/src/roles'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    organizationId: string
    userId: string
  }
}

export async function getMembership(slug: string) {
  return api.get(`organizations/${slug}/membership`).json<GetMembershipResponse>()
}
