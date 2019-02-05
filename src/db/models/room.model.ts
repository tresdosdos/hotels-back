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

import Floor from './floor.model';

@Table({tableName: 'room'})
export default class Room extends Model<Room> {
  @ForeignKey(() => Floor)
  @AllowNull(false)
  @Column
  floorId: number;

  @BelongsTo(() => Floor)
  floor: Floor;

  @Unique
  @AllowNull(false)
  @Is('number bigger than 1', (val: number) => {
    return +val > 1;
  })
  @Column({type: DataType.SMALLINT(5)})
  number: number;
}
