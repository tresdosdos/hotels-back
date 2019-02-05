import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey, HasMany,
  IsEmail,
  Length,
  Model,
  Table,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import ExternalUser from './external-user.model';
import LocalUser from './local-user.model';
import Hotel from './hotel.model';

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

  @Unique
  @Length({max: 30})
  @Column
  username: string;

  @Column
  avatar: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
