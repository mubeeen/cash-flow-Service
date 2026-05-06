import { ServerException } from '../base/server.exception';

export class ServiceUnavailableException extends ServerException {
  constructor(message = 'Service unavailable') { super(message, 503); }
}
