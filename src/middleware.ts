import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
  const isLoggedIn = request.cookies.has('token');
  const isGuestPage = ['/login', '/register'].includes(request.nextUrl.pathname);
  const isProtectedPage =
    !isGuestPage &&
    (['/', '/user'].includes(request.nextUrl.pathname) || request.nextUrl.pathname.startsWith('/products'));

  if (isLoggedIn && isGuestPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
};
