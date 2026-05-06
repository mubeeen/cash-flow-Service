import { cookies } from 'next/headers';
import { AuthService } from './auth.service';
import { withSpan } from '@/lib/tracing';
import { toUserDto } from '@/lib/dto';
import { apiSuccess, handleError } from '@/lib/response';

export class AuthController {
  static async register(request: Request) {
    return withSpan('AuthController.register', async () => {
      try {
        const body = await request.json();
        const user = await AuthService.register(body);
        return apiSuccess(toUserDto(user), 201);
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

        return apiSuccess(toUserDto(user));
      } catch (error) {
        return handleError(error);
      }
    });
  }

  static async logout() {
    return withSpan('AuthController.logout', async () => {
      cookies().delete('session');
      return apiSuccess({ message: 'Logged out' });
    });
  }
}
