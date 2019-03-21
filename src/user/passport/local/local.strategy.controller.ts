import { Controller, Post, Body, Res, UseGuards, Req, Next, Put } from '@nestjs/common';

import { UserModel } from '../../user.model';
import { LocalGuard } from './local.guard';
import { UserService } from '../../user.service';
import { EmailService, JwtService } from '../../../services';
import { LoggerService } from '../../../logger';
import { JwtGuard } from '../../guards';
import { BadRequestError, NoLocalAccountError, InvalidEmailError } from '../../../utils';

@Controller('user')
export class LocalStrategyController {

    constructor(
        private userService: UserService,
        private emailService: EmailService,
        private logger: LoggerService,
        private jwtService: JwtService,
    ) {
    }

    @Post('signUp')
    async signUp(@Body() body: UserModel, @Res() res) {
        const user = await this.userService.createLocalUser(body);
        const {id, email} = user;
        await this.emailService.sendRegistrationMail({id, email});
        const msg = `Registration request was sent to ${email}`;
        this.logger.info(msg);

        res.send({message: msg});
    }

    @Post('signIn')
    @UseGuards(LocalGuard)
    async signIn(@Req() req, @Res() res) {
        const userToken = this.jwtService.generateUserToken({user: req.user});

        res.set('Authorization', userToken);
        res.send(req.user);
    }

    @Put('')
    @UseGuards(JwtGuard)
    async resetPassword(@Req() req, @Res() res) {
        const {password, username} = req.body;

        if (!req.body) {
            throw new BadRequestError();
        }

        if (password && !req.user.localUserId) {
            throw new NoLocalAccountError();
        }

        let user;

        if (password) {
            user = await this.userService.changePassword(req.user.email, password);
        } else {
            user = await this.userService.changeUsername(req.user.email, username);
        }

        const token = this.jwtService.generateUserToken({user});

        res.set('Authorization', token);
        res.send(user);
    }

    @Put('activate')
    @UseGuards(JwtGuard)
    async activateAccount(@Req() req, @Res() res) {
        const user = await this.userService.activate(req.user);
        const token = this.jwtService.generateUserToken({user});

        res.set('Authorization', token);
        res.send(user);
    }

    @Put('reset')
    async sendResetEmail(@Body() body, @Res() res, @Next() next) {
        const {email} = body;
        const user = await this.userService.getByEmail(email);

        if (!user) {
            throw new NoLocalAccountError();
        }

        try {
            await this.emailService.sendResetMail({email});
            const msg = `Reset email was sent to ${email}`;
            this.logger.info(msg);

            res.send({message: msg});
        } catch (err) {
            throw new InvalidEmailError();
        }
    }

}
