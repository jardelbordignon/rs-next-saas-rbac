'use server'

import { api } from './api-client'

interface GetInvitesPendingItemResponse {
  id: string
  email: string
  role: string
  createdAt: string
  author: {
    id: string
    name: string
    avatarUrl: string
  }
  organization: {
    id: string
    name: string
    avatarUrl: string
  }
}

interface GetInvitesPendingResponse {
  invites: GetInvitesPendingItemResponse[]
}

export async function getInvitesPending() {
  return api.get('invites/pending').json<GetInvitesPendingResponse>()
}
