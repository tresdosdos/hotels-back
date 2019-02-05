import { AllowNull, Column, HasOne, Model, Table } from 'sequelize-typescript';

import User from './user.model';

@Table({ tableName: 'external_user' })
export default class ExternalUser extends Model<ExternalUser> {
  @HasOne(() => User)
  user: User;

  @AllowNull(false)
  @Column
  lastSystem: string;
}
