import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db';
import { UserModule } from './user';
import { JwtMiddleware } from './middleware';
import { HotelModule } from './hotel/hotel.module';
import { RoomModule } from './room/room.module';
import { RentModule } from './rent/rent.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DbModule,
    UserModule.forRoot(),
    HotelModule,
    RoomModule,
    RentModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('user');
  }
}
