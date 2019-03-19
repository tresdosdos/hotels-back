import { Module, forwardRef } from '@nestjs/common';

import { UserModule } from '../../user.module';
import { GoogleStrategy } from './google.strategy';
import { GoogleStrategyController } from './google.strategy.controller';

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [
        GoogleStrategy,
    ],
    controllers: [GoogleStrategyController],
    exports: [GoogleStrategy],
})
export class GoogleStrategyModule {
}
