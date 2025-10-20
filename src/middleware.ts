import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // Admin route'larına sadece admin role'üne sahip kullanıcılar erişebilir
    if (isAdminRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Admin route'ları için token ve role kontrolü
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && token.role === 'admin'
        }
        // Diğer protected route'lar için sadece token kontrolü
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/orders/:path*', '/address/:path*'],
}

