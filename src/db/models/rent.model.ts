import {
    Column, DataType,
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

    @Column({type: DataType.TIME})
    startDate: Date;

    @Column({type: DataType.TIME})
    endDate: Date;
}
