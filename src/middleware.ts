import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const PROTECTED_PATHS = ['/expenses', '/dashboard'];

export function middleware(request: NextRequest) {
  // 1. Attach request ID to every request
  const requestId = request.headers.get('x-request-id') || uuidv4();
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  // 2. Auth check for protected routes
  const isProtected = PROTECTED_PATHS.some((path) => request.nextUrl.pathname.startsWith(path));
  if (isProtected) {
    const session = request.cookies.get('session');
    if (!session) {
      const loginResponse = NextResponse.redirect(new URL('/login', request.url));
      loginResponse.headers.set('x-request-id', requestId);
      return loginResponse;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
