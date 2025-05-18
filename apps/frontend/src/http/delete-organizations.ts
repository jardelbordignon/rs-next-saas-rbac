import { api } from './api-client'

export async function deleteOrganizations(orgSlug: string) {
  return api.delete(`organizations/${orgSlug}`)
}
