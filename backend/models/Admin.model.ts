import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

// Define the attributes
interface AdminAttributes {
  id: number;
  hashedEmail: string;
  hashedPassword: string;
  email: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

// Make id optional for creation
interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: number;
  public hashedEmail!: string;
  public hashedPassword!: string;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public role: string = 'admin'; // ✅ default or optional
  public fullName?: string;      // optional, or initialize if needed
  public isEmailVerified: boolean = true; // ✅ default to true for admin
}


// Initialize the model
Admin.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    hashedEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {  // ✅ Add this field
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: true,
  }
);

export default Admin;
