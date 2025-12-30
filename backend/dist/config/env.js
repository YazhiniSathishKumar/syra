"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_FROM = exports.EMAIL_PASS = exports.EMAIL_USER = exports.EMAIL_SERVICE = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
exports.EMAIL_SERVICE = process.env.EMAIL_SERVICE;
exports.EMAIL_USER = process.env.EMAIL_USER;
exports.EMAIL_PASS = process.env.EMAIL_PASS;
exports.EMAIL_FROM = process.env.EMAIL_FROM;
