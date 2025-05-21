import { api } from './api-client'
import type { Role } from '@repo/authorizations'

interface PostOrganizationInvitesRequest {
  orgSlug: string
  email: string
  role: Role
}

interface PostOrganizationInvitesResponse {
  inviteId: string
}

export async function postOrganizationInvites(data: PostOrganizationInvitesRequest) {
  const { orgSlug, ...json } = data
  return api
    .post(`organizations/${orgSlug}/invites`, { json })
    .json<PostOrganizationInvitesResponse>()
}
