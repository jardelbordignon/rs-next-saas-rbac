import { api } from './api-client'

interface PostProjectsRequest {
  orgSlug: string
  name: string
  description: string
}

interface PostProjectsResponse {
  name: string
  description: string
  avatarUrl: string
  isPrivate: boolean
  slug: string
}

export async function postProjects(data: PostProjectsRequest) {
  const { orgSlug, ...json } = data
  return api
    .post(`organizations/${orgSlug}/projects`, { json })
    .json<PostProjectsResponse>()
}
