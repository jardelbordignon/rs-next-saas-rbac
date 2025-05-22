import { api } from './api-client'

interface GetOrganizationProjectsResponseItem {
  project: {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    description: string
    slug: string
    avatarUrl: string
    isPrivate: boolean
  }
  owner: {
    id: string
    name: string
    email: string
    avatarUrl: string
  }
}

export type GetOrganizationProjectsResponse = GetOrganizationProjectsResponseItem[]

export async function getOrganizationProjects(orgSlug: string) {
  return api
    .get(`organizations/${orgSlug}/projects`)
    .json<GetOrganizationProjectsResponse>()
}
