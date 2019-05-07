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

    @BelongsTo(() => Room, {
        foreignKey: {
            unique: 'rent_unique',
        },
    })
    room: Room;

    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => User, {
        foreignKey: {
            unique: 'rent_unique',
        },
    })
    user: User;

    @AllowNull(false)
    @Column({unique: 'rent_unique'})
    startDate: Date;

    @AllowNull(false)
    @Column({type: DataType.ENUM, values: ['rent', 'reserve']})
    status: string;

    @AllowNull(false)
    @Column
    passportNumber: string;

    @AllowNull(false)
    @Column
    surname: string;

    @AllowNull(false)
    @Column
    name: string;

    @AllowNull(false)
    @Column({unique: 'rent_unique'})
    endDate: Date;
}
