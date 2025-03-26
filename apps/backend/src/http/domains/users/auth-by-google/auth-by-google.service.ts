import { env } from '@/env'
import { UnauthorizedError } from '@/http/errors'
import { authSocialHandler } from '../auth-social-handler/auth-social.handler'
import type { GoogleOAuthResponse, GoogleUserResponse } from './google-requests.type'
import type { FastifyInstance } from 'fastify'

type AuthByGoogleData = {
  code: string
}

export async function authByGoogleService(
  jwt: FastifyInstance['jwt'],
  { code }: AuthByGoogleData,
) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = env

  const googleOAuthResponse = await fetch('https://oauth2.googleapis.com/token', {
    body: JSON.stringify({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code: code.replace('%2F', '/'),
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_REDIRECT_URI,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!googleOAuthResponse.ok) {
    throw new UnauthorizedError('Google authentication failed')
  }

  const { access_token }: GoogleOAuthResponse = await googleOAuthResponse.json()
  console.log('access_token:', access_token)

  const googleUserUrl = new URL('https://www.googleapis.com/oauth2/v1/userinfo')
  googleUserUrl.searchParams.append('alt', 'json')
  googleUserUrl.searchParams.append('access_token', access_token)

  const googleUseResponse = await fetch(googleUserUrl)

  const googleUserData: GoogleUserResponse = await googleUseResponse.json()
  console.log('googleUserData:', googleUserData)

  const { email, id, name, picture: avatarUrl } = googleUserData

  return authSocialHandler(jwt, {
    avatarUrl,
    email,
    name,
    provider: {
      id,
      type: 'GOOGLE',
    },
  })
}
