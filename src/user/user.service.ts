import * as _ from 'lodash';
import { Inject, Injectable } from '@nestjs/common';

import { User, LocalUser, ExternalUser, Image } from '../db/models';
import {
  BadRequestError,
  InvalidEmailError, InvalidUsernameError,
  JsonWebTokenError,
  UserExistsError,
} from '../utils/errors';
import { Symbols } from '../symbols';
import {ImageService} from '../services/image.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(Symbols.User) private user: typeof User,
    @Inject(Symbols.LocalUser) private localUser: typeof LocalUser,
    @Inject(Symbols.ExternalUser) private externalUser: typeof ExternalUser,
    @Inject(Symbols.Image) private image: typeof Image,
    private imageService: ImageService,
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
    console.log(user);
    const newLocalUser = new this.localUser({
      password: user.password,
      confirmed: true,
    });

    try {
      if (!foundUser) {
        const savedLocalUser = await newLocalUser.save();
        const newUser = new this.user({
          localUserId: savedLocalUser.toJSON().id,
          email: user.email,
        });
        const savedUser = await newUser.save();

        return Object.assign(savedLocalUser.toJSON(), savedUser.toJSON());
      }

      if (!foundUser.toJSON().localUserId) {
        const savedLocalUser = await newLocalUser.save();
        const updatedUser = await foundUser.update({
          localUserId: savedLocalUser.toJSON().id,
        });

        return Object.assign(savedLocalUser.toJSON(), updatedUser.toJSON());
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

  public async updateAvatar(id: number, {url, imageId}) {
    let user = await this.user.findOne({
      where: { id },
      include: [this.localUser.scope('public'), this.image],
      rejectOnEmpty: new JsonWebTokenError(),
    });

    user = user.toJSON();
    let image: Image | null = null;

    if (url) {
      image = await this.imageService.save({userId: user.id}, url);
      user.avatar = image.toJSON();
    } else {
      await this.imageService.delete(imageId);
      user.avatar = null;
    }

    return user;
  }
}
