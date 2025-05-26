import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { postInviteAccept } from '@/http/post-invite-accept'
import { postSigninSocial } from '@/http/post-signin-social'

export async function GET(request: NextRequest) {
  const { code, provider } = Object.fromEntries(request.nextUrl.searchParams)

  if (!code || !provider) {
    return NextResponse.json(
      { message: 'provider or code parameter not found' },
      { status: 400 },
    )
  }

  const { accessToken } = await postSigninSocial({ code, provider })

  const { set, delete: remove } = await cookies()

  set('accessToken', accessToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  const inviteId = request.cookies.get('inviteId')?.value

  if (inviteId) {
    try {
      await postInviteAccept(inviteId)
      remove('inviteId')
      //request.cookies.delete('inviteId')
    } catch {
      // Intentionally ignore errors from postInviteAccept
    }
  }

  return NextResponse.redirect(new URL('/', request.url))
}
