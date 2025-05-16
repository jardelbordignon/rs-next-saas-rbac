import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  // const apiKey = request.cookies.get('apiKey')

  // if (!apiKey) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  const response = NextResponse.next()

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/org')) {
    const slug = pathname.split('/')[2]
    response.cookies.set('org', slug)
  } else {
    response.cookies.delete('org')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
