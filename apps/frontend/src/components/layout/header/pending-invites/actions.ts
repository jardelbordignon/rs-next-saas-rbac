'use server'

import { revalidateTag } from 'next/cache'
import { postInviteAccept } from '@/http/post-invite-accept'
import { postInviteReject } from '@/http/post-invite-reject'

export async function acceptInviteAction(inviteId: string) {
  await postInviteAccept(inviteId)
  revalidateTag('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await postInviteReject(inviteId)
  revalidateTag('organizations')
}
