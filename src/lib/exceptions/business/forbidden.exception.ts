import { BusinessException } from '../base/business.exception';

export class ForbiddenException extends BusinessException {
  constructor(message = 'Forbidden') { super(message, 403); }
}
