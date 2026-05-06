import bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { withSpan } from '@/lib/tracing';
import { UnauthorizedException, ConflictException } from '@/lib/exceptions';
import { validate, RegisterSchema, LoginSchema } from '@/lib/validators';

export class AuthService {
  static async register(data: unknown) {
    return withSpan('AuthService.register', async () => {
      const { name, email, password } = validate(RegisterSchema, data);

      const exists = await AuthRepository.findByEmail(email);
      if (exists) throw new ConflictException('Email already registered');

      const hashedPassword = await bcrypt.hash(password, 10);
      return AuthRepository.create({ email, password: hashedPassword, name });
    });
  }

  static async login(data: unknown) {
    return withSpan('AuthService.login', async () => {
      const { email, password } = validate(LoginSchema, data);

      const user = await AuthRepository.findByEmail(email);
      if (!user) throw new UnauthorizedException('Invalid email or password');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new UnauthorizedException('Invalid email or password');

      return user;
    });
  }
}
