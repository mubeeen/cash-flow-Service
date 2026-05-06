import { BusinessException } from '../base/business.exception';

export class UnauthorizedException extends BusinessException {
  constructor(message = 'Unauthorized') { super(message, 401); }
}
