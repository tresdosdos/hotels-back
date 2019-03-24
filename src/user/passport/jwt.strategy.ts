import * as _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser, ExternalUser, Image } from '../../db/models';
import { JsonWebTokenError } from '../../utils/errors';
import { Symbols } from '../../symbols';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.LocalUser) private localUser: typeof LocalUser,
    @Inject(Symbols.ExternalUser) private externalUser: typeof ExternalUser,
    @Inject(Symbols.Image) private image: typeof Image,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload) {
    let foundUser = await this.user.findOne({
      where: { email: payload.user.email },
      include: [this.localUser, this.externalUser, this.image],
    });

    if (!foundUser) {
      throw new JsonWebTokenError();
    }

    foundUser = foundUser.toJSON();

    return _.omit(foundUser, 'localUser.hashedPassword');
  }
}
