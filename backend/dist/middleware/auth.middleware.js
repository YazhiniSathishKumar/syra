"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt_utils_1 = require("../utils/jwt.utils");
const User_model_1 = __importDefault(require("../models/User.model"));
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                message: 'Access token required',
                error: 'TOKEN_MISSING'
            });
            return;
        }
        const decoded = (0, jwt_utils_1.verifyToken)(token);
        const user = await User_model_1.default.findByPk(decoded.id, {
            attributes: ['id', 'email', 'fullName', 'isEmailVerified']
        });
        if (!user) {
            res.status(401).json({
                message: 'Invalid token',
                error: 'INVALID_TOKEN'
            });
            return;
        }
        if (!user.isEmailVerified) {
            res.status(401).json({
                message: 'Email not verified',
                error: 'EMAIL_NOT_VERIFIED'
            });
            return;
        }
        req.user = {
            id: user.id,
            email: user.email
        };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            message: 'Invalid token',
            error: 'TOKEN_INVALID'
        });
    }
};
exports.authenticateToken = authenticateToken;
