import { BadRequestException } from '@nestjs/common';

export class BadRequestError extends BadRequestException {
  constructor() {
    super('Bad request');
  }
}
