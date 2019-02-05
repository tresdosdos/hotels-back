import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ServicesModule } from '../services';
import { LoggerModule } from '../logger';
import {
  GoogleStrategy,
  JwtStrategy,
  LinkedinStrategy,
  GithubStrategy,
  LocalStrategy,
} from './passport';

@Module({
  imports: [ServicesModule, LoggerModule],
  providers: [
    UserService,
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    LinkedinStrategy,
    GithubStrategy,
  ],
  controllers: [UserController],
  exports: [JwtStrategy],
})
export class UserModule {}
