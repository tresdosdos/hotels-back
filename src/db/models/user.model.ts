import {
    AllowNull,
    BelongsTo, BelongsToMany,
    Column,
    CreatedAt,
    ForeignKey, HasMany, HasOne,
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
import Rent from './rent.model';
import Room from './room.model';
import Image from './image.model';

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

  @HasOne(() => Image)
  avatar: Image;

  @BelongsToMany(() => Room, () => Rent)
  rooms: Room[];

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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
