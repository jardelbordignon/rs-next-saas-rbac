import { api } from './api-client'
import type { Role } from '@repo/authorizations/src/roles'

interface GetOrganizationMembersResponse {
  members: [
    {
      id: string
      role: Role
      userId: string
      name: string
      email: string
      avatarUrl: string
    },
  ]
}

export async function getOrganizationMembers(orgSlug: string) {
  return api
    .get(`organizations/${orgSlug}/members`)
    .json<GetOrganizationMembersResponse>()
}
