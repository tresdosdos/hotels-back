import { BadRequestException } from '@nestjs/common';

export class PollOptionsError extends BadRequestException {
  constructor() {
    super('Incorrect options');
  }
}
