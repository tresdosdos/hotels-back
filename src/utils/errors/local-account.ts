import { BadRequestException } from '@nestjs/common';

export class NoLocalAccountError extends BadRequestException {
  constructor() {
    super('You don\'t have a local account');
  }
}
