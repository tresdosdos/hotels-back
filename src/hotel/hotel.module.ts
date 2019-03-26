import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import {UserModule} from '../user';

@Module({
  imports: [UserModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
