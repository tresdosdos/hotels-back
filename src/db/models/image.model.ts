import {
    AllowNull,
    Column,
    Model,
    Table,
    HasOne, ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import User from './user.model';
import Hotel from './hotel.model';
import Room from './room.model';

@Table({tableName: 'image'})
export default class Image extends Model<Image> {
    @ForeignKey(() => Hotel)
    hotelId: number;

    @BelongsTo(() => Hotel)
    hotel: Hotel;

    @ForeignKey(() => User)
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @AllowNull(false)
    @Column
    url: string;

    @AllowNull(false)
    @Column
    shortUrl: string;
}
