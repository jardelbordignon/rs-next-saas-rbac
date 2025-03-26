export type GoogleOAuthResponse = {
  access_token: string
  expires_in: number
  scope: string
  token_type: 'Bearer'
  id_token: string
}

export type GoogleUserResponse = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}
