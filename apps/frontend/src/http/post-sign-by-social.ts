import { api } from './api-client'

interface PostSignBySocialRequest {
  code: string
  social: 'facebook' | 'github' | 'google'
}

interface PostSignBySocialResponse {
  accessToken: string
}

export async function postSignBySocial(data: PostSignBySocialRequest) {
  const { code, social } = data
  return api
    .post(`signin/${social}`, { json: { code } })
    .json<PostSignBySocialResponse>()
}
