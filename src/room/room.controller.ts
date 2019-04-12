import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import {JwtGuard} from '../user/guards';
import {RoomService} from './room.service';
import {IRoom} from './interfaces';

@Controller('room')
@UseGuards(JwtGuard)
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get('user/:id')
    public async list(@Param('id', new ParseIntPipe()) id, @Res() res) {
        const hotels = await this.roomService.list(id);

        res.send(hotels);
    }

    @Get(':id')
    public async getById(@Param('id', new ParseIntPipe()) id) {
        return this.roomService.getById(id);
    }

    @Post()
    public async createRoom(@Req() req, @Res() res) {
        const room = await this.roomService.create(req.body);

        res.send(room);
    }

    @Put()
    public updateRoom(@Body() hotel: IRoom) {
        return this.roomService.update(hotel);
    }

    @Delete(':id')
    public deleteRoom(@Param('id', new ParseIntPipe()) id) {
        return this.roomService.delete(id);
    }
}
