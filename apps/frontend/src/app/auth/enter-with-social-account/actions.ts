'use server'

import { redirect } from 'next/navigation'

//https://github.com/login/oauth/authorize?client_id=<GITHUB_CLIENT_ID>&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email

export async function enterWithGithub() {
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID)
  url.searchParams.set('redirect_uri', process.env.GITHUB_REDIRECT_URI)
  url.searchParams.set('scope', 'user:email')

  redirect(url.toString())
}
