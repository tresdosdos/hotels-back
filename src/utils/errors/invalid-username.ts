import { BadRequestException } from '@nestjs/common';

export class InvalidUsernameError extends BadRequestException {
  constructor() {
    super('Invalid username');
  }
}
