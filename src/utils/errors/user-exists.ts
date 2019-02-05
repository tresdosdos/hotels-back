import { BadRequestException } from '@nestjs/common';

export class UserExistsError extends BadRequestException {
  constructor() {
    super('This user exists');
  }
}
