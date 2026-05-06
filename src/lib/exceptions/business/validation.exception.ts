import { BusinessException } from '../base/business.exception';

export class ValidationException extends BusinessException {
  constructor(message = 'Validation failed') { super(message, 422); }
}
