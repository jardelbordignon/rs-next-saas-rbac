import { api } from './api-client'

interface UpdateOrganizationsRequest {
  orgSlug: string
  name: string
  domain: string
  shouldAttachUsersByDomain: boolean
}

export async function updateOrganizations(data: UpdateOrganizationsRequest) {
  const { orgSlug, ...json } = data

  return api.put(`organizations/${orgSlug}`, { json })
}
