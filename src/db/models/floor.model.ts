import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey, HasMany, Is,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';

import Hotel from './hotel.model';
import Room from './room.model';

@Table({tableName: 'floor'})
export default class Floor extends Model<Floor> {
  @ForeignKey(() => Hotel)
  @AllowNull(false)
  @Column
  hotelId: number;

  @BelongsTo(() => Hotel)
  hotel: Hotel;

  @HasMany(() => Room)
  rooms: Room[];

  @Unique
  @AllowNull(false)
  @Is('number bigger than 1', (val: number) => {
    return +val > 1;
  })
  @Column({type: DataType.NUMERIC})
  level: number;
}
