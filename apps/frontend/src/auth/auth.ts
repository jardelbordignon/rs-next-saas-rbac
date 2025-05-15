import { cookies as _cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getProfile } from '@/http/get-profile'

export async function isAuthenticated() {
  const cookies = await _cookies()

  return !!cookies.get('accessToken')?.value
}

export async function auth() {
  const cookies = await _cookies()

  const accessToken = cookies.get('accessToken')?.value

  if (!accessToken) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()
    return { user }
  } catch {
    cookies.delete('accessToken')
  }

  redirect('/auth/sign-in')
}
