import { BusinessException } from '../base/business.exception';

export class BadRequestException extends BusinessException {
  constructor(message = 'Bad request') { super(message, 400); }
}
