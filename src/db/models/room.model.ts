import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey, HasMany,
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
  @Column({type: DataType.SMALLINT(5)})
  number: number;
}
