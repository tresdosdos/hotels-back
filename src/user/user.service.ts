import * as _ from 'lodash';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser, ExternalUser } from '../db/models';
import {
  BadRequestError,
  InvalidEmailError, InvalidUsernameError,
  JsonWebTokenError,
  UserExistsError,
} from '../utils/errors';
import { Symbols } from '../symbols';
import {UserRole} from './user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.LocalUser) private localUser: typeof LocalUser,
    @Inject(Symbols.ExternalUser) private externalUser: typeof ExternalUser,
  ) {}

  public async getById(id) {
    const user = await this.user.scope('public').findOne({ where: { id } });

    if (user) {
      return user.toJSON();
    }

    return null;
  }

  public async getByEmail(email) {
    const user = await this.user.findOne({ where: { email } });

    if (user) {
      return user.toJSON();
    }

    return null;
  }

  public async createLocalUser(user) {
    const foundUser = await this.user.findOne({ where: { email: user.email } });
    const newLocalUser = new this.localUser({
      password: user.password,
      confirmed: false,
    });

    try {
      if (!foundUser) {
        let savedLocalUser = await newLocalUser.save();
        savedLocalUser = savedLocalUser.toJSON();

        const newUser = new this.user({
          localUserId: savedLocalUser.id,
          email: user.email,
          role: UserRole.GUEST,
        });
        const savedUser = await newUser.save();

        return Object.assign(savedLocalUser, savedUser.toJSON());
      }

      if (!foundUser.toJSON().localUserId) {
        let savedLocalUser = await newLocalUser.save();
        savedLocalUser = savedLocalUser.toJSON();

        const updatedUser = await foundUser.update({
          localUserId: savedLocalUser.id,
        });

        return Object.assign(savedLocalUser, updatedUser.toJSON());
      }

      throw new UserExistsError();
    } catch (err) {
      switch (err.name) {
        case 'SequelizeValidationError': {
          throw new InvalidEmailError();
        }
        case 'SequelizeUniqueConstraintError': {
          throw new UserExistsError();
        }
        default: {
          throw err;
        }
      }
    }
  }

  public async activate(user) {
    const foundUser = await this.user.findOne({
      where: { email: user.email },
      include: [this.localUser.scope('public')],
      rejectOnEmpty: new JsonWebTokenError(),
    });
    await foundUser.localUser.update({ confirmed: true });

    return foundUser.toJSON();
  }

  public async changePassword(email, password) {
    const foundUser = await this.user.findOne({
      where: { email },
      include: [this.localUser.scope('public')],
      rejectOnEmpty: new JsonWebTokenError(),
    });

    if (!foundUser.localUser) {
      return;
    }

    if (password.length < 8) {
      throw new BadRequestError();
    }

    try {
      await foundUser.localUser.update(
        Object.assign({ confirmed: true, password }),
      );
    } catch (err) {
      throw new BadRequestError();
    }

    return _.omit(
      foundUser.toJSON(),
      'localUser.password',
      'localUser.hashedPassword',
    );
  }

  public async changeUsername(email, username) {
    const foundUser = await this.user.findOne({
      where: { email },
      include: [this.localUser.scope('public')],
      rejectOnEmpty: new JsonWebTokenError(),
    });

    try {
      await foundUser.update({ username });
    } catch (err) {
      throw new InvalidUsernameError();
    }

    return _.omit(
      foundUser.toJSON(),
      'localUser.password',
      'localUser.hashedPassword',
    );
  }

  public async createExternalUser(email, lastSystem) {
    const newExternalUser = new this.externalUser({ lastSystem });

    try {
      const foundUser = await this.user.findOne({ where: { email } });

      if (!foundUser) {
        const savedExternalUser = await newExternalUser.save();
        const user = new this.user({
          email,
          externalUserId: savedExternalUser.toJSON().id,
          role: UserRole.GUEST,
        });
        const savedUser = await user.save();

        return Object.assign(savedExternalUser.toJSON(), savedUser.toJSON());
      }

      if (!foundUser.toJSON().externalUserId) {
        const savedExternalUser = await newExternalUser.save();
        const updatedUser = await foundUser.update({
          externalUserId: savedExternalUser.toJSON().id,
        });

        return Object.assign(savedExternalUser.toJSON(), updatedUser.toJSON());
      }

      const externalUser = await this.externalUser.findOne({
        where: { id: foundUser.externalUserId },
      });
      await externalUser.update({ lastSystem });

      return Object.assign(foundUser.toJSON(), externalUser.toJSON());
    } catch (err) {
      switch (err.name) {
        case 'SequelizeValidationError': {
          throw new InvalidEmailError();
        }
        case 'SequelizeUniqueConstraintError': {
          throw new UserExistsError();
        }
        default: {
          throw err;
        }
      }
    }
  }

  public async updateAvatar(email: string, avatar: string) {
    const user = await this.user.findOne({
      where: { email },
      include: [this.localUser.scope('public')],
      rejectOnEmpty: new JsonWebTokenError(),
    });

    await user.update({ avatar: avatar || null });

    return user;
  }
}
