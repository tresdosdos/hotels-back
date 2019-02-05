import * as _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser } from '../../db/models';
import { JsonWebTokenError } from '../../utils/errors';
import { Symbols } from '../../symbols';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.LocalUser) private localUser: typeof LocalUser,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    let foundUser = await this.user.findOne({
      where: { email: payload.user.email },
      include: [this.localUser],
    });

    if (!foundUser) {
      throw new JsonWebTokenError();
    }

    foundUser = foundUser.toJSON();

    return _.omit(foundUser, 'localUser.hashedPassword');
  }
}
