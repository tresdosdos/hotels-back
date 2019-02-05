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
import Floor from './floor.model';

@Table({ tableName: 'hotel' })
export default class Hotel extends Model<Hotel> {
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @HasMany(() => Floor)
    floors: Floor[];

    @Unique
    @Length({ max: 50 })
    @AllowNull(false)
    @Column
    name: string;

    @Column
    photo: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}
