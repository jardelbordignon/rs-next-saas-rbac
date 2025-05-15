'use server'

import { redirect } from 'next/navigation'

export async function enterWithFacebook() {
  const url = new URL('https://www.facebook.com/v13.0/dialog/oauth')
  url.searchParams.set('client_id', process.env.FACEBOOK_CLIENT_ID)
  url.searchParams.set('redirect_uri', process.env.FACEBOOK_REDIRECT_URI)
  url.searchParams.set('scope', 'email')

  redirect(url.toString())
}

export async function enterWithGithub() {
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID)
  url.searchParams.set('redirect_uri', process.env.GITHUB_REDIRECT_URI)
  url.searchParams.set('scope', 'user:email')

  redirect(url.toString())
}
