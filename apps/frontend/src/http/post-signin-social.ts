import { api } from './api-client'

export interface PostSigninSocialRequest {
  code: string
  social: string // 'facebook' | 'github' | 'google'
}

interface PostSigninSocialResponse {
  accessToken: string
}

export async function postSigninSocial(data: PostSigninSocialRequest) {
  const { code, social } = data
  return api
    .post(`signin/${social}`, { json: { code } })
    .json<PostSigninSocialResponse>()
}
