export interface UserModel {
  id?: number;
  email: string;
  username?: string;
  password?: string;
  confirmed?: boolean;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
