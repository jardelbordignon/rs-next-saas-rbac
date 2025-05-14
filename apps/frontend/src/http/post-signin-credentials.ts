import { api } from './api-client'

interface PostSigninCredentialsRequest {
  email: string
  password: string
}

interface PostSigninCredentialsResponse {
  accessToken: string
}

export async function postSigninCredentials(json: PostSigninCredentialsRequest) {
  return api
    .post('signin/credentials', { json })
    .json<PostSigninCredentialsResponse>()
}
