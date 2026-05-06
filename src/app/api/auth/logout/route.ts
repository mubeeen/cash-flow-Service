import { AuthController } from '@/modules/auth/auth.controller';

export async function POST() {
  return AuthController.logout();
}
