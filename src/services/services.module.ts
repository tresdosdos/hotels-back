import { Module } from '@nestjs/common';

import { ToolsModule } from '../tools';
import { EmailService } from './email';
import { ConfigModule } from '../config';
import { JwtService } from './jwt.service';

@Module({
  imports: [ToolsModule, ConfigModule],
  providers: [EmailService, JwtService],
  exports: [EmailService, JwtService],
})
export class ServicesModule {}
