export type FacebookOAuthResponse = {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export type FacebookUserResponse = {
  id: string
  name: string
  email: string
  picture: {
    data: {
      height: number
      is_silhouette: boolean
      url: string
      width: number
    }
  }
}
