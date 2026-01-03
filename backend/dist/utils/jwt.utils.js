"use strict";
// import jwt, { SignOptions } from 'jsonwebtoken';
// import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
// // export const generateToken = (userId: number): string => {
// //   const options: SignOptions = {
// //     expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'], // Safe cast
// //   };
// //   return jwt.sign({ id: userId }, JWT_SECRET, options);
// // };
// export const verifyToken = (token: string): any => {
//   return jwt.verify(token, JWT_SECRET);
// };
// export const generateToken = (payload: { id: number; role: string }): string => {
//   const options: SignOptions = {
//     expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
//   };
//   return jwt.sign(payload, JWT_SECRET, options);
// };
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const generateToken = (payload) => {
    const options = {
        expiresIn: env_1.JWT_EXPIRES_IN,
    };
    return jsonwebtoken_1.default.sign(payload, env_1.JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
};
exports.verifyToken = verifyToken;
