import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import { Sequelize } from 'sequelize-typescript';

import * as models from './models';
import { Symbols } from '../symbols';

dotenv.config();

export const databaseProviders = [
  {
    provide: Symbols.SequelizeToken,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: false,
        dialectOptions: {
          ssl: {
              require: true,
              rejectUnauthorized: false
          }
        },
        operatorsAliases: {
          $gt: Sequelize.Op.gt,
        },
      });
      sequelize.addModels([
        ..._.values(models),
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
