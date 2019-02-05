import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

import { JwtService } from '../services';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      if (!req.headers.authorization) {
        return next();
      }

      const oldToken = req.headers.authorization;
      const payload = this.jwtService.verifyAndDecodeToken(oldToken);

      const newToken = this.jwtService.generateUserToken({
        user: payload.user,
      });

      res.set('Authorization', newToken);
      req.headers.authorization = newToken;

      next();
    };
  }
}
