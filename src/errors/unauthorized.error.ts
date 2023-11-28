import { ICustomError } from '../interfaces'

export class UnAuthorizedError extends Error implements ICustomError {
  status: number;

  constructor(message = 'Unauthorized access') {
    super(message);
    this.name = 'UnAuthorizedError';
    this.status = 401;

    Object.setPrototypeOf(this, UnAuthorizedError.prototype);
  }
}
