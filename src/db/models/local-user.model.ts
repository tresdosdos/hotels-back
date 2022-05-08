import * as bcrypt from 'bcrypt';
import {
  AllowNull,
  Column,
  DataType,
  HasOne,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

import User from './user.model';

@Scopes({
  public: {
    attributes: {
      exclude: ['hashedPassword'],
    },
  },
})
@Table({ tableName: 'local_user' })
export default class LocalUser extends Model<LocalUser> {
  @HasOne(() => User)
  user: User;

  @AllowNull(false)
  @Column({
    type: DataType.VIRTUAL,
    set(val) {
      const salt = bcrypt.genSaltSync();
      console.log(val, salt);
      const hash = bcrypt.hashSync(val, salt);
      this.setDataValue('hashedPassword', hash);
      this.setDataValue('password', val);
    },
  })
  password: string;

  @AllowNull(false)
  @Column
  hashedPassword: string;

  @AllowNull(false)
  @Column
  confirmed: boolean;
}
