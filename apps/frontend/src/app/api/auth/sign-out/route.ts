import { cookies as _cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const cookies = await _cookies()

  cookies.delete('accessToken')

  return NextResponse.redirect(new URL('/auth/sign-in', request.url))
}
