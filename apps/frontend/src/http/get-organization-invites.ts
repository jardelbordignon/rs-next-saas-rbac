import { api } from './api-client'
import type { Role } from '@repo/authorizations'

interface GetOrganizationInvitesResponse {
  invites: [
    {
      id: string
      email: string
      role: Role
      createdAt: string
      author: {
        id: string
        name: string | null
      } | null
    },
  ]
}

export async function getOrganizationInvites(orgSlug: string) {
  return api
    .get(`organizations/${orgSlug}/invites`, {
      next: { tags: [`organizations/${orgSlug}/invites`] },
    })
    .json<GetOrganizationInvitesResponse>()
}
