import type { AtLeastOneOptional } from '@/lib/typescript'
import { api } from './api-client'
import type { Role } from '@repo/authorizations'

type UpdateOrganizationMemberRequest = {
  orgSlug: string
  memberId: string
} & AtLeastOneOptional<{
  role?: Role
  organizationId?: string
}>

export async function updateOrganizationMember(
  data: UpdateOrganizationMemberRequest,
) {
  const { orgSlug, memberId, ...json } = data
  return api.put(`organizations/${orgSlug}/members/${memberId}`, { json })
}
