import { UnauthorizedException } from '@nestjs/common';

export class NoPermissionError extends UnauthorizedException {
  constructor() {
    super('You have no permission to update this poll');
  }
}
