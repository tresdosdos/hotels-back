import { UnauthorizedException } from '@nestjs/common';

export class NoLocalAccountError extends UnauthorizedException {
  constructor() {
    super('You don\'t have a local account');
  }
}
