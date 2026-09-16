import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Runs on the Edge runtime; getToken only verifies the JWT (via
// NEXTAUTH_SECRET) and never touches Prisma/bcrypt, which are not
// Edge-compatible and live in lib/authOptions.js instead.
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isApi = pathname.startsWith('/api/admin');
  const isLoginPage = pathname === '/admin/login';

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  } else if (isLoginPage) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
