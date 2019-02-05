import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { UserModel } from './user.model';
import { UserService } from './user.service';
import { LoggerService } from '../logger';
import { ConfigService } from '../config';
import { EmailService, JwtService } from '../services';
import { FileUploadInterceptor } from '../utils';
import {
  AccountConfirmError,
  BadRequestError,
  InvalidEmailError,
  NoLocalAccountError,
} from '../utils/errors';
import { GoogleGuard, JwtGuard, LinkedinGuard, GithubGuard, LocalGuard } from './guards';
import {UserSystems} from './user-systems.enum';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private emailService: EmailService,
    private logger: LoggerService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(@Req() req, @Res() res) {
    const user = await this.userService.createExternalUser(
      req.user.email,
      UserSystems.GOOGLE,
    );
    const token = await this.jwtService.generateUserToken({ user });

    res.redirect(`${this.config.CLIENT_URL}/callback/${token}`);
  }

  @Get('linkedin')
  @UseGuards(LinkedinGuard)
  linkedinAuth() {}

  @Get('linkedin/callback')
  @UseGuards(LinkedinGuard)
  async linkedinAuthCallback(@Req() req, @Res() res) {
    const user = await this.userService.createExternalUser(
      req.user.email,
      UserSystems.LINKEDIN,
    );
    const token = await this.jwtService.generateUserToken({ user });

    res.redirect(`${this.config.CLIENT_URL}/callback/${token}`);
  }

  @Get('github')
  @UseGuards(GithubGuard)
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubGuard)
  async githubAuthCallback(@Req() req, @Res() res) {
    const user = await this.userService.createExternalUser(
      req.user.email,
      UserSystems.GITHUB,
    );
    const token = await this.jwtService.generateUserToken({ user });

    res.redirect(`${this.config.CLIENT_URL}/callback/${token}`);
  }

  @Post('signup')
  async signUp(@Body() body: UserModel) {
    const user = await this.userService.createLocalUser(body);
    const { id, email } = user;

    await this.emailService.sendRegistrationMail({ id, email });

    const msg = `Registration request was sent to ${email}`;
    this.logger.info(msg);

    return { message: msg };
  }

  @Post('signin')
  @UseGuards(LocalGuard)
  async signIn(@Req() req, @Res() res) {
    const userToken = this.jwtService.generateUserToken({ user: req.user });

    res.set('Authorization', userToken);
    res.send(req.user);
  }

  @Post('avatar')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileUploadInterceptor)
  async updateAvatar(@UploadedFile() file, @Req() req, @Res() res) {
    const user = await this.userService.updateAvatar(req.user.email, file && file.secure_url);

    res.send(user);
  }

  @Get('')
  @UseGuards(JwtGuard)
  async getUser(@Req() req, @Res() res) {
    if (req.user.localUser && !req.user.localUser.confirmed) {
      throw new AccountConfirmError();
    }

    res.send(req.user);
  }

  @Put('')
  @UseGuards(JwtGuard)
  async resetPassword(@Req() req, @Res() res) {
    const { password, username } = req.body;

    if (!password && !username) {
      throw new BadRequestError();
    }

    if (password && !req.user.localUserId) {
      throw new NoLocalAccountError();
    }

    let user;

    if (password) {
      user = await this.userService.changePassword(req.user.email, password);
    } else if (username) {
      user = await this.userService.changeUsername(req.user.email, username);
    }

    const token = this.jwtService.generateUserToken({ user });

    res.set('Authorization', token);
    res.send(user);
  }

  @Put('activate')
  @UseGuards(JwtGuard)
  async activateAccount(@Req() req, @Res() res) {
    const user = await this.userService.activate(req.user);
    const token = this.jwtService.generateUserToken({ user });

    res.set('Authorization', token);
    res.send(user);
  }

  @Put('reset')
  async sendResetEmail(@Body() body: Partial<UserModel>) {
    const { email } = body;
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new InvalidEmailError();
    }

    try {
      await this.emailService.sendResetMail({ email });
      const msg = `Reset email was sent to ${email}`;
      this.logger.info(msg);

      return { message: msg };
    } catch (err) {
      throw new InvalidEmailError();
    }
  }
}
