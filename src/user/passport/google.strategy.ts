import { OAuth2Strategy } from 'passport-google-oauth';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser } from '../../db/models';
import { Symbols } from '../../symbols';

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy) {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.ExternalUser) private externalUser: typeof LocalUser,
  ) {
    super({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.BASE_URL}/user/google/callback`,
      scope: ['profile', 'email'],
      session: false,
      failureRedirect: '/signin',
    });
  }

  async validate(accessToken, refreshToken, profile) {
    const userData = {
      email: profile.emails[0].value,
      token: accessToken,
    };

    return userData;
  }
}
