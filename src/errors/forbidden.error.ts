import { ICustomError } from '../interfaces'

export class ForbiddenError extends Error implements ICustomError {
  status: number;

  constructor(message = 'Forbidden access') {
    super(message);
    this.name = 'Forbidden';
    this.status = 403;

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
