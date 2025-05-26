'use server'

import { api } from './api-client'

export async function postInviteAccept(inviteId: string) {
  return api.post(`invites/${inviteId}/accept`)
}
