import { api } from './api-client'

interface GetProjectsResponseItem {
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

type GetProjectsResponse = GetProjectsResponseItem[]

export async function getProjects(orgSlug: string) {
  return api.get(`organizations/${orgSlug}/projects`).json<GetProjectsResponse>()
}
