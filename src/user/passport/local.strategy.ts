import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser } from '../../db/models';
import {
  AccountConfirmError,
  InvalidCredentialsError,
  InvalidEmailError,
} from '../../utils/errors';
import { Symbols } from '../../symbols';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.LocalUser) private localUser: typeof LocalUser,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  async validate(email, password) {
    let foundUser = await this.user.findOne({
      where: { email },
      include: [this.localUser],
    });

    if (!foundUser) {
      throw new InvalidEmailError();
    }

    foundUser = foundUser.toJSON();

    if (!foundUser.localUserId) {
      throw new InvalidEmailError();
    }

    if (!foundUser.localUser.confirmed) {
      throw new AccountConfirmError();
    }

    const isMatch = await bcrypt.compare(
      password,
      foundUser.localUser.hashedPassword,
    );

    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    return _.omit(foundUser, 'localUser.hashedPassword');
  }
}
