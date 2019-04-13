import { Module } from '@nestjs/common';
import { RentController } from './rent.controller';
import {RentService} from './rent.service';
import {UserModule} from '../user';

@Module({
  imports: [UserModule],
  controllers: [RentController],
  providers: [RentService]
})
export class RentModule {}
