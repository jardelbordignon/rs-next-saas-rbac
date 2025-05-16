import { api } from './api-client'

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    role: 'ADMIN' | 'BILLING' | 'MEMBER'
  }[]
}

export async function getOrganizations() {
  return api.get('organizations').json<GetOrganizationsResponse>()
}
