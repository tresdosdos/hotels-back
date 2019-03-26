import { BadRequestException } from '@nestjs/common';

export class HotelExistsError extends BadRequestException {
  constructor() {
    super('There is no such hotel');
  }
}
