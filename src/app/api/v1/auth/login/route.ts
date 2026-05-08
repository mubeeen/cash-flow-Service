import { AuthController } from '@/modules/auth/auth.controller';

export async function POST(request: Request) {
  return AuthController.login(request);
}
