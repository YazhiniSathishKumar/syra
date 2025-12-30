"use strict";
// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/db';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class OTP extends sequelize_1.Model {
}
OTP.init({
    code: {
        type: sequelize_1.DataTypes.STRING(10),
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
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                args: true,
                msg: 'expiresAt must be a valid date',
            },
        },
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('login', 'password_reset', 'signup'),
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
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // Optional, but recommended to use
        validate: {
            isIn: {
                args: [['admin', 'tester', 'user', 'client']], // ✅ added 'client'
                msg: 'Role must be one of admin, tester, user, or client',
            },
        },
    },
}, {
    sequelize: db_1.default,
    modelName: 'OTP',
    tableName: 'OTPs',
    indexes: [
        { fields: ['userId', 'type'], unique: false },
        { fields: ['expiresAt'] },
    ],
});
exports.default = OTP;
