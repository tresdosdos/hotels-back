import {
    AllowNull, BelongsTo,
    Column, DataType,
    ForeignKey,
    Model, PrimaryKey,
    Table,
} from 'sequelize-typescript';
import User from './user.model';
import Room from './room.model';

@Table({tableName: 'rent'})
export default class Rent extends Model<Rent> {
    @ForeignKey(() => Room)
    roomId: number;

    @BelongsTo(() => Room)
    room: Room;

    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @AllowNull(false)
    @Column
    startDate: Date;

    @AllowNull(false)
    @Column({type: DataType.ENUM, values: ['rent', 'reserve']})
    status: string;

    @AllowNull(false)
    @Column
    endDate: Date;
}
