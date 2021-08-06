import { ValidationError } from 'express-validator';
import { CustomError } from './customErrors';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters!');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
