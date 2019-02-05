import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser } from '../../db/models';
import { Symbols } from '../../symbols';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.ExternalUser) private externalUser: typeof LocalUser,
  ) {
    super({
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: `${process.env.BASE_URL}/user/github/callback`,
      scope: ['user:email'],
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
