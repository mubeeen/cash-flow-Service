// Base
export { HttpException } from './base/http.exception';
export { BusinessException } from './base/business.exception';
export { ServerException } from './base/server.exception';

// Business (4xx)
export { BadRequestException } from './business/bad-request.exception';
export { UnauthorizedException } from './business/unauthorized.exception';
export { ForbiddenException } from './business/forbidden.exception';
export { NotFoundException } from './business/not-found.exception';
export { ConflictException } from './business/conflict.exception';
export { ValidationException } from './business/validation.exception';

// Server (5xx)
export { InternalServerException } from './server/internal-server.exception';
export { ServiceUnavailableException } from './server/service-unavailable.exception';
