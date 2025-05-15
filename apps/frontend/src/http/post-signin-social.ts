import { api } from './api-client'

export interface PostSigninSocialRequest {
  code: string
  provider: string // 'facebook' | 'github' | 'google'
}

interface PostSigninSocialResponse {
  accessToken: string
}

export async function postSigninSocial(data: PostSigninSocialRequest) {
  const { code, provider } = data
  return api
    .post(`signin/${provider}`, { json: { code } })
    .json<PostSigninSocialResponse>()
}
