import {
    AllowNull,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import User from './user.model';
import Room from './room.model';

@Table({tableName: 'rent'})
export default class Rent extends Model<Rent> {
    @ForeignKey(() => Room)
    roomId: number;

    @ForeignKey(() => User)
    userId: number;

    @AllowNull(false)
    @Column
    startDate: Date;

    @AllowNull(false)
    @Column
    endDate: Date;
}
