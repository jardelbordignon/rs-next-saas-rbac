import { api } from './api-client'

interface PostSignupRequest {
  name: string
  email: string
  password: string
}

export async function postSignup(json: PostSignupRequest) {
  await api.post('signup', { json })
}
