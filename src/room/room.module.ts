import { Module } from '@nestjs/common';
import {UserModule} from '../user';
import {RoomController} from './room.controller';
import {RoomService} from './room.service';

@Module({
    imports: [UserModule],
    controllers: [RoomController],
    providers: [RoomService],
})
export class RoomModule {}
