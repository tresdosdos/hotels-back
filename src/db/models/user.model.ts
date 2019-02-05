import * as _ from 'lodash';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt, DataType,
  ForeignKey, HasMany,
  IsEmail,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import ExternalUser from './external-user.model';
import LocalUser from './local-user.model';
import Hotel from './hotel.model';
import {UserRole} from '../../user/user-role.enum';

@Table({tableName: 'user'})
export default class User extends Model<User> {
  @ForeignKey(() => ExternalUser)
  externalUserId: number;

  @BelongsTo(() => ExternalUser)
  externalUser: ExternalUser;

  @ForeignKey(() => LocalUser)
  localUserId: number;

  @BelongsTo(() => LocalUser)
  localUser: LocalUser;

  @HasMany(() => Hotel)
  hotels: Hotel[];

  @IsEmail
  @Unique
  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column({type: DataType.ENUM, values: _.values(UserRole)})
  role: UserRole;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
