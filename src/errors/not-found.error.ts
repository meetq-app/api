import { ICustomError } from '../interfaces'

export class NotFoundError extends Error implements ICustomError {
  status: number;

  constructor(message = 'Not Found') {
    super(message);
    this.name = 'NotFound';
    this.status = 404;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
