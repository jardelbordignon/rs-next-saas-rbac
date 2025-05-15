import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { postSigninSocial } from '@/http/post-signin-social'

export async function GET(request: NextRequest) {
  const { code, social } = Object.fromEntries(request.nextUrl.searchParams)

  if (!code || !social) {
    return NextResponse.json(
      { message: 'social or code parameter not found' },
      { status: 400 },
    )
  }

  const { accessToken } = await postSigninSocial({ code, social })

  const { set } = await cookies()

  set('accessToken', accessToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.redirect(new URL('/', request.url))
}
