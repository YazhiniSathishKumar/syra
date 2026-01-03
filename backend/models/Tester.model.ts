import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Tester extends Model {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public hashedPassword!: string;
  public role!: 'tester';
  public isEmailVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tester.init(
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('tester'),
      allowNull: false,
      defaultValue: 'tester'
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Tester',
    tableName: 'Testers'
  }
);

export default Tester;
