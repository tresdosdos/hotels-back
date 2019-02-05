import { BadRequestException } from '@nestjs/common';

export class InvalidFileError extends BadRequestException {
  constructor() {
    super('Invalid file format');
  }
}
