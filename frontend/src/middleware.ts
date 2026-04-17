import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!token && !isPublic) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
