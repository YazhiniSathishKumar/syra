"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Tester extends sequelize_1.Model {
}
Tester.init({
    fullName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    hashedPassword: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('tester'),
        allowNull: false,
        defaultValue: 'tester'
    }
}, {
    sequelize: db_1.default,
    modelName: 'Tester',
    tableName: 'Testers'
});
exports.default = Tester;
