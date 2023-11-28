import { ICustomError } from '../interfaces'

export class InvalidCreedentialsdError extends Error implements ICustomError {
  status: number;
  details: Array<{[key: string]: string}>

  constructor(message = 'Invalid Creedentials', details = []) {
    super(message);
    this.name = 'InvalidCreedentials';
    this.status = 400;
    this.details = details;
    Object.setPrototypeOf(this, InvalidCreedentialsdError.prototype);
  }
}
