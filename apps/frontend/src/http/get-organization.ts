import { api } from './api-client'

interface GetOrganizationResponse {
  organization: {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    slug: string
    avatarUrl: string | null
    domain: string | null
    shouldAttachUsersByDomain: boolean
    ownerId: string
  }
}

export async function getOrganization(orgSlug: string) {
  return api.get(`organizations/${orgSlug}`).json<GetOrganizationResponse>()
}
