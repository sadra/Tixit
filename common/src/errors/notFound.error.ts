import { CustomError } from './customErrors';

export class NotFoundError extends CustomError {
  statusCode: number = 404;

  constructor() {
    super('Not Found!');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'Not Found!' }];
  }
}
