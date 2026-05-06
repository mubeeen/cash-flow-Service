import { HttpException } from './http.exception';

export class BusinessException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
