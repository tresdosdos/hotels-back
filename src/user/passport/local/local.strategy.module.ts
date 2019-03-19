import { Module, forwardRef } from '@nestjs/common';

import { UserModule } from '../../user.module';
import { LocalStrategy } from './local.strategy';
import { LocalStrategyController } from './local.strategy.controller';

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [
        LocalStrategy,
    ],
    controllers: [LocalStrategyController],
    exports: [LocalStrategy],
})
export class LocalStrategyModule {
}
