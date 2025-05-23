'use server'

import { api } from './api-client'
import type { Role } from '@repo/authorizations'

interface GetInviteResponse {
  invite: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
    organization: {
      id: string
      name: string
      avatarUrl: string
    }
  }
}

export async function getInvite(inviteId: string) {
  return api.get(`invites/${inviteId}`).json<GetInviteResponse>()
}
