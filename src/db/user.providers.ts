import { User, LocalUser, ExternalUser } from './models';
import { Symbols } from '../symbols';

export const userProviders = [
  {
    provide: Symbols.User,
    useValue: User,
  },
  {
    provide: Symbols.LocalUser,
    useValue: LocalUser,
  },
  {
    provide: Symbols.ExternalUser,
    useValue: ExternalUser,
  },
];
