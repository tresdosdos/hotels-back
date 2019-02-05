import { Module } from '@nestjs/common';

import { EmailSdk, JwtSdk } from './';
import { ConfigModule } from '../config';
import { DbModule } from '../db';

@Module({
  imports: [ConfigModule, DbModule],
  providers: [JwtSdk, EmailSdk],
  exports: [JwtSdk, EmailSdk],
})
export class ToolsModule {}
