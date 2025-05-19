'use server'

import { revalidateTag } from 'next/cache'
import { getCurrentOrgCookie } from '@/auth/auth'
import { deleteOrganizationMember } from '@/http/delete-organization-member'

export async function removeMemberAction(memberId: string) {
  const orgSlug = await getCurrentOrgCookie()
  if (!orgSlug) return

  await deleteOrganizationMember({ orgSlug, memberId })

  revalidateTag(`organizations/${orgSlug}/members`)
}
