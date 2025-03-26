import { env } from '@/env'
import { UnauthorizedError } from '@/http/errors'
import { authSocialHandler } from '../auth-social-handler/auth-social.handler'
import type { GithubOAuthResponse, GithubUserResponse } from './github-requests.type'
import type { FastifyInstance } from 'fastify'

type AuthByGithubData = {
  code: string
}

export async function authByGithubService(
  jwt: FastifyInstance['jwt'],
  { code }: AuthByGithubData,
) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI } = env

  const githubOAuthUrl = new URL('https://github.com/login/oauth/access_token')

  githubOAuthUrl.searchParams.append('client_id', GITHUB_CLIENT_ID)
  githubOAuthUrl.searchParams.append('client_secret', GITHUB_CLIENT_SECRET)
  githubOAuthUrl.searchParams.append('redirect_uri', GITHUB_REDIRECT_URI)
  githubOAuthUrl.searchParams.append('code', code)

  const githubOAuthResponse = await fetch(githubOAuthUrl, {
    headers: { Accept: 'application/json' },
    method: 'POST',
  })

  if (!githubOAuthResponse.ok) {
    throw new UnauthorizedError('Github authentication failed')
  }

  const githubOAuthData: GithubOAuthResponse = await githubOAuthResponse.json()

  const githubUserResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${githubOAuthData.access_token}`,
    },
  })

  if (!githubUserResponse.ok) {
    throw new UnauthorizedError('Github authentication failed')
  }

  const githubUserData: GithubUserResponse = await githubUserResponse.json()

  const { avatar_url: avatarUrl, email, id, name } = githubUserData

  return authSocialHandler(jwt, {
    avatarUrl,
    email,
    name,
    provider: {
      id: String(id),
      type: 'GITHUB',
    },
  })
}
