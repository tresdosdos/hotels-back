import {Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {JwtGuard} from '../user/guards';
import {RentService} from './rent.service';

@Controller('rent')
@UseGuards(JwtGuard)
export class RentController {
    constructor(private rentService: RentService) {}

    @Get('user')
    public async getTickets(@Req() req, @Res() res) {
        const tickets = await this.rentService.getTickets(req.user.id);

        res.send(tickets);
    }

    @Post()
    public async createRent(@Req() req, @Res() res) {
        const rent = await this.rentService.createRent(req.user.id, req.body);

        res.send(rent);
    }
}
