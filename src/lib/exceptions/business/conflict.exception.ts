import { BusinessException } from '../base/business.exception';

export class ConflictException extends BusinessException {
  constructor(message = 'Conflict') { super(message, 409); }
}
