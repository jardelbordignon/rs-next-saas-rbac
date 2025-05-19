import { api } from './api-client'

interface DeleteOrganizationMemberProps {
  orgSlug: string
  memberId: string
}

export async function deleteOrganizationMember({
  memberId,
  orgSlug,
}: DeleteOrganizationMemberProps) {
  return api.delete(`organizations/${orgSlug}/members/${memberId}`)
}
