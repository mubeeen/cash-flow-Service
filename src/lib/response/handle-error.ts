import { HttpException } from '@/lib/exceptions';
import { apiError } from '@/lib/response';
import { logger } from '@/lib/logger';

export function handleError(error: unknown) {
  if (error instanceof HttpException) {
    logger.warn({ err: error, statusCode: error.statusCode }, error.message);
    return apiError(error.message, error.statusCode);
  }

  logger.error({ err: error }, 'Unhandled error');
  return apiError('Internal server error', 500);
}
