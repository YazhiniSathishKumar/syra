"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
// routes/admin.auth.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin_model_1.default.findOne({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const emailMatch = await bcrypt_1.default.compare(email, admin.hashedEmail);
        const passwordMatch = await bcrypt_1.default.compare(password, admin.hashedPassword);
        if (!emailMatch || !passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT or session logic here
        res.json({ message: 'Admin logged in successfully' });
    }
    catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.adminLogin = adminLogin;
