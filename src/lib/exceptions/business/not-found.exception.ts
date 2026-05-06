import { BusinessException } from '../base/business.exception';

export class NotFoundException extends BusinessException {
  constructor(message = 'Not found') { super(message, 404); }
}
