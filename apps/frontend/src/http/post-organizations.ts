import { api } from './api-client'

interface PostOrganizationsRequest {
  name: string
  domain: string
  shouldAttachUsersByDomain: boolean
}

interface PostOrganizationsResponse {
  organizationId: string
}

export async function postOrganizations(json: PostOrganizationsRequest) {
  return api.post('organizations', { json }).json<PostOrganizationsResponse>()
}
