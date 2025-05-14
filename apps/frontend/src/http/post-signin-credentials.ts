import { api } from './api-client'

interface Request {
  email: string
  password: string
}

interface Response {
  accessToken: string
}

export async function postSigninCredentials(json: Request) {
  return api.post('signin/credentials', { json }).json<Response>()
}
