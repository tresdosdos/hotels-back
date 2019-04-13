import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put, Query,
    Req,
    Res, UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {JwtGuard} from '../user/guards';
import {HotelService} from './hotel.service';
import {IHotel} from './interfaces';
import {FileUploadInterceptor} from '../utils';

@Controller('hotel')
export class HotelController {
    constructor(private hotelService: HotelService) {}

    @Get('cities')
    public async getCities() {
        return await this.hotelService.getCities();
    }

    @Get('user/:id')
    @UseGuards(JwtGuard)
    public async list(@Param('id', new ParseIntPipe()) id, @Res() res) {
        const hotels = await this.hotelService.list(id);

        res.send(hotels);
    }

    @Get(':id')
    public getById(@Param('id', new ParseIntPipe()) id) {
        return this.hotelService.getById(id);
    }

    @Get()
    public getByParams(@Query() query) {
        return this.hotelService.getByParams(query);
    }

    @Post()
    @UseGuards(JwtGuard)
    public async createHotel(@Req() req, @Res() res) {
        const hotel =await this.hotelService.create(req.body, req.user.id);

        res.send(hotel);
    }

    @Put()
    @UseGuards(JwtGuard)
    public updateHotel(@Body() hotel: IHotel) {
        return this.hotelService.update(hotel);
    }

    @Delete(':id')
    @UseGuards(JwtGuard)
    public deleteHotel(@Param('id', new ParseIntPipe()) id) {
        return this.hotelService.delete(id);
    }

    @Post(':id/photo')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileUploadInterceptor)
    public uploadPhoto(
        @Param('id', new ParseIntPipe()) id,
        @UploadedFile() file,
    ) {
        return this.hotelService.uploadPhoto(id, file.secure_url);
    }
}
