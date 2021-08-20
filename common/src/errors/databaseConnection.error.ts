import { CustomError } from './customErrors';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connection to database';

  constructor() {
    super('Error connection to database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.reason }];
  }
}
