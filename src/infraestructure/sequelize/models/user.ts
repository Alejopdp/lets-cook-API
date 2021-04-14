import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  resetPasswordCode: number;
  resetPasswordExpires: Date;
  emailVerificationCode: number;
  deletionFlag: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<IUser>, IUser {}
export class User extends Model<UserModel, IUser> {}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export function UserFactory(sequelize: Sequelize): UserStatic {
  return <UserStatic>sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phoneNumber: {
        type: DataTypes.STRING,
      },

      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      resetPasswordCode: {
        type: DataTypes.INTEGER,
      },

      resetPasswordExpires: {
        type: DataTypes.DATE,
      },

      emailVerificationCode: {
        type: DataTypes.INTEGER,
      },

      deletionFlag: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    { tableName: "User", timestamps: true }
  );
}
