// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/db';

// class OTP extends Model {
//   public id!: number;
//   public code!: string;
//   public expiresAt!: Date;
//   public userId!: number;
//   public type!: 'login' | 'password_reset'| 'signup' ;
//   public attempts!: number;
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// OTP.init(
//   {
//     code: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       validate: {
//         len: {
//           args: [4, 8],
//           msg: 'OTP code must be between 4 and 8 characters'
//         }
//       }
//     },
//     expiresAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       validate: {
//         isDate: true
//       }
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Users',
//         key: 'id'
//       },
//       onDelete: 'CASCADE'
//     },
//     type: {  // Added type field
//       type: DataTypes.ENUM('login', 'password_reset','signup'),
//       defaultValue: 'login',
//       allowNull: false,
//       validate: {
//         isIn: {
//           args: [['login', 'password_reset','signup']],
//           msg: 'Type must be either login or password_reset'
//         }
//       }
//     },attempts: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     }
//   },
//   {
//     sequelize,
//     modelName: 'OTP',
//     indexes: [
//       {
//         fields: ['userId', 'type'],
//         unique: false
//       },
//       {
//         fields: ['expiresAt']
//       }
//     ]
//   }
// );

// export default OTP;







import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class OTP extends Model {
  public id!: number;
  public code!: string;
  public expiresAt!: Date;
  public userId!: number;
  public type!: 'login' | 'password_reset' | 'signup';
  public attempts!: number;
  public role!: 'admin' | 'tester' | 'user' | 'client';  // ✅ New role field
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OTP.init(
  {
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        len: {
          args: [4, 10],
          msg: 'OTP code must be between 4 and 10 characters',
        },
        is: {
          args: /^[A-Za-z0-9]+$/i,
          msg: 'OTP must contain only letters and numbers',
        },
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: 'expiresAt must be a valid date',
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('login', 'password_reset', 'signup'),
      defaultValue: 'login',
      allowNull: false,
      validate: {
        isIn: {
          args: [['login', 'password_reset', 'signup']],
          msg: 'Type must be one of login, password_reset, or signup',
        },
      },
    },
    attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true, // Optional, but recommended to use
      validate: {
        isIn: {
          args: [['admin', 'tester', 'user', 'client']], // ✅ added 'client'
          msg: 'Role must be one of admin, tester, user, or client',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'OTP',
    tableName: 'OTPs',
    indexes: [
      { fields: ['userId', 'type'], unique: false },
      { fields: ['expiresAt'] },
    ],
  }
);

export default OTP;
