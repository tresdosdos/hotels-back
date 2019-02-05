import { Strategy } from 'passport-linkedin-oauth2';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser } from '../../db/models';
import { Symbols } from '../../symbols';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.ExternalUser) private externalUser: typeof LocalUser,
  ) {
    super({
      clientID: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: `${process.env.BASE_URL}/user/linkedin/callback`,
      scope: ['r_emailaddress', 'r_basicprofile'],
      session: false,
      failureRedirect: '/signin',
    });
  }

  async validate(token, tokenSecret, profile) {
    const userData = {
      email: profile.emails[0].value,
      token,
    };

    return userData;
  }
}
