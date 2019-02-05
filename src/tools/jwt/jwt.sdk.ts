import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../config';
import { JsonWebTokenError, TokenExpiredError } from '../../utils/errors';

@Injectable()
export class JwtSdk {
  constructor(private config: ConfigService) {}

  public generateToken(payload: object, expIn, alg = 'HS256') {
    return jwt.sign(payload, this.config.JWT_SECRET, {
      algorithm: alg,
      expiresIn: expIn,
    });
  }

  public verifyAndDecodeToken(token) {
    try {
      return jwt.verify(token, this.config.JWT_SECRET);
    } catch (err) {
      switch (err.name) {
        case 'TokenExpiredError': {
          throw new TokenExpiredError();
        }
        case 'JsonWebTokenError': {
          throw new JsonWebTokenError();
        }
        default: {
          throw new JsonWebTokenError();
        }
      }
    }
  }
}
