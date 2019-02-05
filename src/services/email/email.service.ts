import * as path from 'path';
import * as pug from 'pug';
import { Injectable } from '@nestjs/common';

import { TemplateOptions } from './template-options.interface';
import { EmailSdk } from '../../tools/email';
import { ConfigService } from '../../config';
import { JwtService } from '../jwt.service';

@Injectable()
export class EmailService {
  constructor(
    private jwtService: JwtService,
    private emailSdk: EmailSdk,
    private config: ConfigService,
  ) { }

  public sendRegistrationMail(request) {
    const { id, email } = request;
    const token = this.jwtService.generateRegistrationToken({
      user: { id, email },
    });
    const link = `${this.config.CLIENT_URL}/activate/${token}`;
    let templatePath;

    if (process.env.NODE_ENV === 'development') {
      templatePath = path.join(__dirname + '/../../../templates/registration.pug');
    } else {
      templatePath = './templates/registration.pug';
    }

    const emailText = this.compileText(
      { link, additionalText: '' },
      templatePath,
    );

    const options = {
      receiver: email,
      subject: 'Confirm your email in poll-app',
      attachment: emailText,
    };

    return this.emailSdk.send(options);
  }

  public sendResetMail(request) {
    const { email } = request;
    const token = this.jwtService.generateResetToken({ user: { email } });
    const link = `${this.config.CLIENT_URL}/reset/${token}`;
    let templatePath;

    if (process.env.NODE_ENV === 'development') {
      templatePath = path.join(__dirname + '/../../../templates/reset.pug');
    } else {
      templatePath = './templates/reset.pug';
    }

    const emailText = this.compileText(
      { link, additionalText: '' },
      templatePath,
    );

    const options = {
      receiver: email,
      subject: 'Reset password in poll-app',
      attachment: emailText,
    };

    return this.emailSdk.send(options);
  }

  public sendPollLinkMail(request) {
    const { id, email, accessKey } = request;

    const link = `${this.config.CLIENT_URL}/polls/${id}${ accessKey ? `?access_key=${accessKey}` : `` }`;
    let templatePath;

    if (process.env.NODE_ENV === 'development') {
      templatePath = path.join(__dirname + '/../../../templates/poll-sharing.pug');
    } else {
      templatePath = './templates/poll-sharing.pug';
    }

    const emailText = this.compileText(
      { link, additionalText: '' },
      templatePath,
    );

    const options = {
      receiver: email,
      subject: 'The poll was shared with you',
      attachment: emailText,
    };

    return this.emailSdk.send(options);
  }

  private compileText(options: TemplateOptions, template: string): string {
    return pug.renderFile(template, options);
  }
}
