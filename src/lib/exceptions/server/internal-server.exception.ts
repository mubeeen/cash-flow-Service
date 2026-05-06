import { ServerException } from '../base/server.exception';

export class InternalServerException extends ServerException {
  constructor(message = 'Internal server error') { super(message, 500); }
}
