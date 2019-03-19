import { Module, DynamicModule } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ServicesModule } from '../services';
import { LoggerModule } from '../logger';
import { PassportStrategyType } from './passport.strategy.type';
import { JwtStrategy } from './passport';
import { GithubStrategyModule } from './passport/github/github.strategy.module';
import { GoogleStrategyModule } from './passport/google/google.strategy.module';
import { LinkedinStrategyModule } from './passport/linkedin/linkedin.strategy.module';
import { LocalStrategyModule } from './passport/local/local.strategy.module';

@Module({
  imports: [ServicesModule, LoggerModule],
  providers: [
    UserService,
    JwtStrategy,
  ],
  controllers: [UserController],
  exports: [UserService, JwtStrategy],
})
export class UserModule {

  private static getPassportStrategies(): PassportStrategyType[] {
    const defaultStrategies = [PassportStrategyType.LOCAL];

    if (!process.env.PASSPORT_STRATEGIES) {
      return defaultStrategies;
    }

    return process.env.PASSPORT_STRATEGIES
      .split(',')
      .map(x => x.trim() as PassportStrategyType);
  }

  public static forRoot(): DynamicModule {
    const strategies = UserModule.getPassportStrategies();

    return UserModule.forStrategies(strategies);
  }

  public static forStrategies(strategies: PassportStrategyType[]): DynamicModule {
    const imports = strategies
      .map(strategy => {
        switch (strategy) {
          case PassportStrategyType.GITHUB:
            return GithubStrategyModule;
          case PassportStrategyType.GOOGLE:
            return GoogleStrategyModule;
          case PassportStrategyType.LINKEDIN:
            return LinkedinStrategyModule;
          case PassportStrategyType.LOCAL:
            return LocalStrategyModule;
          default:
            // console.error(`Wrong strategy "${strategy}" specified`);
            return null;
        }
      })
      .filter(strategy => strategy !== null);

    return {
      module: UserModule,
      imports,
    };
  }

}
