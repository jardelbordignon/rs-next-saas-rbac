import { env } from '@/env'
import { UnauthorizedError } from '@/http/errors'
import { authSocialHandler } from '../auth-social-handler/auth-social.handler'
import type {
  FacebookOAuthResponse,
  FacebookUserResponse,
} from './facebook-requests.type'
import type { FastifyInstance } from 'fastify'

type AuthByFacebookData = {
  code: string
}

export async function authByFacebookService(
  jwt: FastifyInstance['jwt'],
  { code }: AuthByFacebookData,
) {
  const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_REDIRECT_URI } = env

  const fbOAuthUrl = new URL('https://graph.facebook.com/oauth/access_token')

  fbOAuthUrl.searchParams.append('client_id', FACEBOOK_CLIENT_ID)
  fbOAuthUrl.searchParams.append('client_secret', FACEBOOK_CLIENT_SECRET)
  fbOAuthUrl.searchParams.append('redirect_uri', FACEBOOK_REDIRECT_URI)
  fbOAuthUrl.searchParams.append('code', code)

  const fbOAuthResponse = await fetch(fbOAuthUrl)

  if (!fbOAuthResponse.ok) {
    throw new UnauthorizedError('Facebook authentication failed')
  }

  const fbOAuthData: FacebookOAuthResponse = await fbOAuthResponse.json()

  const fbUserUrl = new URL('https://graph.facebook.com/v13.0/me')

  fbUserUrl.searchParams.append('fields', 'id, name, email, picture')
  fbUserUrl.searchParams.append('access_token', fbOAuthData.access_token)

  const fbUserResponse = await fetch(fbUserUrl)

  if (!fbUserResponse.ok) {
    throw new UnauthorizedError('Facebook authentication failed')
  }

  const fbUserData: FacebookUserResponse = await fbUserResponse.json()

  const { email, id, name, picture } = fbUserData

  return authSocialHandler(jwt, {
    avatarUrl: picture.data.url,
    email,
    name,
    provider: {
      id,
      type: 'FACEBOOK',
    },
  })
}
