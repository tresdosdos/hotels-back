import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../config';

@Injectable()
export class EmailSdk {
  private server;

  constructor(private config: ConfigService) {
    this.server = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });
  }

  public send(options) {
    return this.server.sendMail({
      text: '',
      from: '"Poll-app" <Poll-app@example.com>',
      to: options.receiver,
      subject: options.subject,
      html: options.attachment,
    });
  }
}
