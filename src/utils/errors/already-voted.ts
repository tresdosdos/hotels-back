import { ForbiddenException } from '@nestjs/common';

export class AlreadyVotedError extends ForbiddenException {
  constructor() {
    super('You already voted');
  }
}
