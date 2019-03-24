import { Module } from '@nestjs/common';

import { ToolsModule } from '../tools';
import { EmailService } from './email';
import { ConfigModule } from '../config';
import { JwtService } from './jwt.service';
import { ImageService } from './image.service';

@Module({
  imports: [ToolsModule, ConfigModule],
  providers: [EmailService, JwtService, ImageService],
  exports: [EmailService, JwtService, ImageService],
})
export class ServicesModule {}
