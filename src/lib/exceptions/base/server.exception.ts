import { HttpException } from './http.exception';

export class ServerException extends HttpException {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
