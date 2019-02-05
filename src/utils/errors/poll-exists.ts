import { BadRequestException } from '@nestjs/common';

export class PollExistsError extends BadRequestException {
  constructor() {
    super('There is no such poll');
  }
}
