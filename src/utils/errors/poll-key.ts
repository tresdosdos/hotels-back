import { UnauthorizedException } from '@nestjs/common';

export class PollKeyError extends UnauthorizedException {
  constructor() {
    super('Wrong poll access key');
  }
}
