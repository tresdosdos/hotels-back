import {Module} from '@nestjs/common';

import {ConfigModule} from '../config';
import {databaseProviders} from './db.providers';
import {userProviders} from './user.providers';
import {hotelProviders} from './hotel.providers';

@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, ...userProviders, ...hotelProviders],
  exports: [...databaseProviders, ...userProviders, ...hotelProviders],
})
export class DbModule {
}
