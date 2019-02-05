import { UnauthorizedException } from '@nestjs/common';

export class AccountConfirmError extends UnauthorizedException {
  constructor() {
    super('Account not confirmed');
  }
}
