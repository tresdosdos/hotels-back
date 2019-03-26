import {
    AllowNull,
    BelongsTo,
    Column,
    CreatedAt,
    ForeignKey, HasMany,
    Length,
    Model,
    Table,
    Unique,
    UpdatedAt,
} from 'sequelize-typescript';
import User from './user.model';
import Room from './room.model';
import Image from './image.model';

@Table({ tableName: 'hotel' })
export default class Hotel extends Model<Hotel> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Room)
    rooms: Room[];

    @HasMany(() => Image)
    images: Image[];

    @Unique
    @Length({ max: 50 })
    @AllowNull(false)
    @Column
    name: string;

    @Column
    address: string;

    @AllowNull(false)
    @Column
    city: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
