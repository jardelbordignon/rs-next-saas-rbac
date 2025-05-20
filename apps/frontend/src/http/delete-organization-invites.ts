import { api } from './api-client'

interface DeleteOrganizationInviteRequest {
  orgSlug: string
  inviteId: string
}

export async function deleteOrganizationInvite({
  inviteId,
  orgSlug,
}: DeleteOrganizationInviteRequest) {
  return api.delete(`organizations/${orgSlug}/invites/${inviteId}`)
}
