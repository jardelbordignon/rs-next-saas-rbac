'use server'

import { api } from './api-client'

export async function postInviteReject(inviteId: string) {
  return api.post(`invites/${inviteId}/reject`)
}
