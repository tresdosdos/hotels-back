import {Controller, Post, Req, Res, UseGuards} from '@nestjs/common';
import {JwtGuard} from '../user/guards';
import {RentService} from './rent.service';

@Controller('rent')
@UseGuards(JwtGuard)
export class RentController {
    constructor(private rentService: RentService) {}

    @Post()
    public async createRent(@Req() req, @Res() res) {
        const rent = await this.rentService.createRent(req.user.id, req.body);

        res.send(rent);
    }
}
