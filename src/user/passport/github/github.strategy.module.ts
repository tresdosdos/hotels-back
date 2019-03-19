import { Module, forwardRef } from '@nestjs/common';

import { GithubStrategy } from './github.strategy';
import { GithubStrategyController } from './github.strategy.controller';
import { UserModule } from '../../user.module';

@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [
        GithubStrategy,
    ],
    controllers: [GithubStrategyController],
    exports: [GithubStrategy],
})
export class GithubStrategyModule {
}
