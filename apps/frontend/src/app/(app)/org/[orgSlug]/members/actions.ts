'use server'

import { revalidateTag } from 'next/cache'
import { getCurrentOrgCookie } from '@/auth/auth'
import { deleteOrganizationInvite } from '@/http/delete-organization-invites'
import { deleteOrganizationMember } from '@/http/delete-organization-member'
import { updateOrganizationMember } from '@/http/update-organization-member'
import type { Role } from '@repo/authorizations'

export async function removeMemberAction(memberId: string) {
  const orgSlug = await getCurrentOrgCookie()
  if (!orgSlug) return

  await deleteOrganizationMember({ orgSlug, memberId })

  revalidateTag(`organizations/${orgSlug}/members`)
}

export async function updateMemberAction(memberId: string, role: Role) {
  const orgSlug = await getCurrentOrgCookie()
  if (!orgSlug) return

  await updateOrganizationMember({ orgSlug, memberId, role })

  revalidateTag(`organizations/${orgSlug}/members`)
}

export async function revokeInviteAction(inviteId: string) {
  const orgSlug = await getCurrentOrgCookie()
  if (!orgSlug || !inviteId) return

  await deleteOrganizationInvite({ orgSlug, inviteId })

  revalidateTag(`organizations/${orgSlug}/invites`)
}
