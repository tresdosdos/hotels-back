import {
    AllowNull,
    BelongsTo, BelongsToMany,
    Column,
    DataType,
    ForeignKey, HasMany,
    Model,
    Table,
    Unique,
} from 'sequelize-typescript';
import Hotel from './hotel.model';
import Rent from './rent.model';
import User from './user.model';
import Image from './image.model';

@Table({tableName: 'room'})
export default class Room extends Model<Room> {
    @ForeignKey(() => Hotel)
    hotelId: number;

    @BelongsTo(() => Hotel)
    hotel: number;

    @BelongsToMany(() => User, () => Rent)
    users: User[];

    @AllowNull(false)
    @Column
    floor: number;

    @Unique
    @AllowNull(false)
    @Column({type: DataType.NUMERIC(5), unique: 'room_uq'})
    number: number;

    @AllowNull(false)
    @Column
    numberOfPlaces: number;

    @AllowNull(false)
    @Column
    cost: number;
}
