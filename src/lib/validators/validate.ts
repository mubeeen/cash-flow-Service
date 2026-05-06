import { ZodSchema, ZodError } from 'zod';
import { ValidationException } from '@/lib/exceptions';

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new ValidationException(message);
    }
    throw error;
  }
}
