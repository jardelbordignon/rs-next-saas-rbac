'use server'

import { type Role, roleSchema } from '@repo/authorizations'
import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { getCurrentOrgCookie } from '@/auth/auth'
import { deleteOrganizationInvite } from '@/http/delete-organization-invites'
import { deleteOrganizationMember } from '@/http/delete-organization-member'
import { postOrganizationInvites } from '@/http/post-organization-invites'
import { updateOrganizationMember } from '@/http/update-organization-member'

const inviteSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  role: roleSchema,
})

export async function createInviteAction(formData: FormData) {
  const inviteData = Object.fromEntries(formData)

  const { success, error, data } = inviteSchema.safeParse(inviteData)

  if (!success) {
    const errors = error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const orgSlug = await getCurrentOrgCookie()
  if (!orgSlug) {
    return {
      success: false,
      message: 'Organization reference not found',
      errors: null,
    }
  }

  try {
    await postOrganizationInvites({ ...data, orgSlug })
    revalidateTag(`organizations/${orgSlug}/invites`)
    return { success: true, message: 'Invite saved successfully', errors: null }
  } catch (error) {
    let message = 'Something went wrong in postInvites'
    if (error instanceof HTTPError) {
      message = (await error.response.json()).message
    }
    return { success: false, message, errors: null }
  }
}

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
