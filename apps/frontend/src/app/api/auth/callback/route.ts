import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { postSignBySocial } from '@/http/post-sign-by-social'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth code not found' },
      { status: 400 },
    )
  }

  const { accessToken } = await postSignBySocial({
    code,
    social: 'github',
  })

  const { set } = await cookies()

  set('accessToken', accessToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.redirect(new URL('/', request.url))
}
