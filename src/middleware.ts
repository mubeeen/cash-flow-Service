import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { rateLimit } from '@/lib/rate-limit';

const PROTECTED_PATHS = ['/expenses', '/dashboard'];

export function middleware(request: NextRequest) {
  // 1. Attach request ID to every request
  const requestId = request.headers.get('x-request-id') || uuidv4();

  // 2. Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.ip || '127.0.0.1';
    const result = rateLimit(ip);

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({ error: { message: 'Too many requests, please try again later', statusCode: 429 } }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Id': requestId,
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetTime),
            'Retry-After': String(retryAfter),
          },
        },
      );
    }

    // Attach rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set('x-request-id', requestId);
    response.headers.set('x-ratelimit-limit', String(result.limit));
    response.headers.set('x-ratelimit-remaining', String(result.remaining));
    response.headers.set('x-ratelimit-reset', String(result.resetTime));
    return response;
  }

  // 3. Non-API routes — just add request ID + auth check
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  // 4. Auth check for protected routes
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
