import { Get, UseGuards, Req, Res, Controller } from '@nestjs/common';

import { LinkedinGuard } from './linkedin.guard';
import { UserService } from '../../user.service';
import { JwtService } from '../../../services';
import { ConfigService } from '../../../config';

@Controller('user/linkedin')
export class LinkedinStrategyController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {
    }

    @Get()
    @UseGuards(LinkedinGuard)
    public auth() {}

    @Get('callback')
    @UseGuards(LinkedinGuard)
    public async authCallback(@Req() req, @Res() res) {
        const user = await this.userService.createExternalUser(
            req.user.email,
            'linkedin',
        );
        const token = await this.jwtService.generateUserToken({user});

        res.redirect(`${this.config.CLIENT_URL}/callback/${token}`);
    }
}
