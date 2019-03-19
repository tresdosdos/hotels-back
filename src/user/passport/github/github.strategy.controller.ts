import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';

import { GithubGuard } from './github.guard';
import { ConfigService } from '../../../config';
import { JwtService } from '../../../services';
import { UserService } from '../../user.service';

@Controller('user/github')
export class GithubStrategyController {

    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {
    }

    @Get()
    @UseGuards(GithubGuard)
    public auth() {}

    @Get('callback')
    @UseGuards(GithubGuard)
    public async authCallback(@Req() req, @Res() res) {
        const user = await this.userService.createExternalUser(
            req.user.email,
            'github',
        );
        const token = await this.jwtService.generateUserToken({user});

        res.redirect(`${this.config.CLIENT_URL}/callback/${token}`);
    }

}
