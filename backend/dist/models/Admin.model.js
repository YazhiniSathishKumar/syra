"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Admin extends sequelize_1.Model {
    constructor() {
        super(...arguments);
        this.role = 'admin'; // ✅ default or optional
        this.isEmailVerified = true; // ✅ default to true for admin
    }
}
// Initialize the model
Admin.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    hashedEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    hashedPassword: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: db_1.default,
    modelName: 'Admin',
    tableName: 'Admins',
    timestamps: true,
});
exports.default = Admin;
