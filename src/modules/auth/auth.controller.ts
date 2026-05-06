import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AuthService } from './auth.service';
import { withSpan } from '@/lib/tracing';
import { HttpException } from '@/lib/exceptions';

function handleError(error: unknown) {
  if (error instanceof HttpException) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export class AuthController {
  static async register(request: Request) {
    return withSpan('AuthController.register', async () => {
      try {
        const body = await request.json();
        await AuthService.register(body);
        return NextResponse.json({ message: 'Account created' }, { status: 201 });
      } catch (error) {
        return handleError(error);
      }
    });
  }

  static async login(request: Request) {
    return withSpan('AuthController.login', async () => {
      try {
        const body = await request.json();
        const user = await AuthService.login(body);

        cookies().set('session', user.id, {
          httpOnly: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({ message: 'Logged in' });
      } catch (error) {
        return handleError(error);
      }
    });
  }

  static async logout() {
    return withSpan('AuthController.logout', async () => {
      cookies().delete('session');
      return NextResponse.json({ message: 'Logged out' });
    });
  }
}
