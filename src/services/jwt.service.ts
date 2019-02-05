import { Injectable } from '@nestjs/common';

import { JwtSdk } from '../tools/jwt';

@Injectable()
export class JwtService {
  constructor(private jwt: JwtSdk) {}

  public generateUserToken(payload) {
    return this.jwt.generateToken(payload, '30 days', 'HS256');
  }

  public generateRegistrationToken(payload) {
    return this.jwt.generateToken(payload, '2h', 'HS256');
  }

  public generateResetToken(payload) {
    return this.jwt.generateToken(payload, '1h', 'HS256');
  }

  public verifyAndDecodeToken(token: string): any {
    return this.jwt.verifyAndDecodeToken(token);
  }
}
