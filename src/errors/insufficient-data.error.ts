import { ICustomError } from '../interfaces'

export class InsufficientDataError extends Error implements ICustomError {
  status: number;
  details: Array<{[key: string]: string}>

  constructor(message = 'Insufficient Data', details = []) {
    super(message);
    this.name = 'InsufficientData';
    this.status = 400;
    this.details = details;
    Object.setPrototypeOf(this, InsufficientDataError.prototype);
  }
}
