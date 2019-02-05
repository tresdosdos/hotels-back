import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import {
  JsonWebTokenError,
  NoTokenError,
  TokenExpiredError,
} from '../../utils/errors';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info) {
      switch (info.name) {
        case 'TokenExpiredError': {
          throw new TokenExpiredError();
        }
        case 'JsonWebTokenError': {
          throw new JsonWebTokenError();
        }
        case 'Error': {
          throw new NoTokenError();
        }
        default: {
          throw new JsonWebTokenError();
        }
      }
    }

    if (err || !user) {
      throw err;
    }

    return user;
  }
}
