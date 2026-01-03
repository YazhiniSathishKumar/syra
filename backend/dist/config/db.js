"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST || 'localhost';
if (!dbName || !dbUser) {
    console.warn('⚠️  Warning: DB_NAME or DB_USER environment variables are missing.');
}
const sequelize = new sequelize_1.Sequelize({
    database: dbName || 'bcbuzz_db',
    username: dbUser || 'root',
    password: dbPassword || '',
    host: dbHost,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
exports.default = sequelize;
