import { prisma } from '@/lib/db';
import { withSpan } from '@/lib/tracing';

export class AuthRepository {
  static findByEmail(email: string) {
    return withSpan('AuthRepository.findByEmail', () =>
      prisma.user.findUnique({ where: { email } }),
      { email },
    );
  }

  static create(data: { email: string; password: string; name: string }) {
    return withSpan('AuthRepository.create', () =>
      prisma.user.create({ data }),
      { email: data.email },
    );
  }
}
