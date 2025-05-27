import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
//import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { delete: remove } = await cookies()
  remove('accessToken')

  //return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  //return NextResponse.redirect('/auth/sign-in')
  redirect('/auth/sign-in')
}
