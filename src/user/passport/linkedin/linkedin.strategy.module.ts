import { Module, forwardRef } from '@nestjs/common';

import { UserModule } from '../../user.module';
import { LinkedinStrategy } from './linkedin.strategy';
import { LinkedinStrategyController } from './linkedin.strategy.controller';

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [
        LinkedinStrategy,
    ],
    controllers: [LinkedinStrategyController],
    exports: [LinkedinStrategy],
})
export class LinkedinStrategyModule {
}
