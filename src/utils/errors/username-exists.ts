import { BadRequestException } from '@nestjs/common';

export class UsernameExistsError extends BadRequestException {
  constructor() {
    super('Such username already exists');
  }
}
