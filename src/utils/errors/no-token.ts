import { BadRequestException } from '@nestjs/common';

export class NoTokenError extends BadRequestException {
  constructor() {
    super('No token');
  }
}
