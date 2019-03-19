import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { Expose, plainToClass } from 'class-transformer';

@Injectable()
export class ConfigService {
  @Expose() public DB_USER: string;
  @Expose() public DB_PASSWORD: string;
  @Expose() public DB_HOST: string;
  @Expose() public DB_NAME: string;
  @Expose() public DB_PORT: number;
  @Expose() public DB_SYNC: number;
  @Expose() public JWT_SECRET: string;
  @Expose() public EMAIL_PORT: number;
  @Expose() public EMAIL_HOST: string;
  @Expose() public EMAIL_USER: string;
  @Expose() public EMAIL_PASS: string;
  @Expose() public GOOGLE_ID: string;
  @Expose() public GOOGLE_SECRET: string;
  @Expose() public LINKEDIN_ID: string;
  @Expose() public LINKEDIN_SECRET: string;
  @Expose() public CLIENT_URL: string;
  @Expose() public BASE_URL: string;
  @Expose() public CLOUDINARY_CLOUD_NAME: string;
  @Expose() public CLOUDINARY_API_KEY: string;
  @Expose() public CLOUDINARY_API_SECRET: string;
  @Expose() public GITHUB_ID: string;
  @Expose() public GITHUB_SECRET: string;

  static create() {
    dotenv.config();
    return plainToClass(ConfigService, process.env, {strategy: 'excludeAll'});
  }
}
