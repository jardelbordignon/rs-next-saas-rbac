import { api } from './api-client'

interface GetProjectsResponse {
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

export async function getProjects(orgSlug: string) {
  return api.get(`organizations/${orgSlug}/projects`).json<GetProjectsResponse>()
}
