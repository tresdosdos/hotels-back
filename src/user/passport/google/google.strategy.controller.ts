import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';

import { UserService } from '../../user.service';
import { JwtService } from '../../../services';
import { ConfigService } from '../../../config';
import { GoogleGuard } from './google.guard';

@Controller('user/google')
export class GoogleStrategyController {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
  }

  @Get()
  @UseGuards(GoogleGuard)
  public auth() {}

  @Get('callback')
  @UseGuards(GoogleGuard)
  public async authCallback(@Req() req, @Res() res) {
    const user = await this.userService.createExternalUser(
      req.user.email,
      'google',
    );
    const token = await this.jwtService.generateUserToken({user});

    res.redirect(`${this.config.CLIENT_URL}/callback/${token}`);
  }

}
