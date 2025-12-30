"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_model_1 = __importDefault(require("../models/User.model"));
const db_1 = __importDefault(require("../config/db"));
const createUser = async () => {
    try {
        await db_1.default.sync();
        const fullName = 'BCBDEV';
        const email = 'bcbdev1@gmail.com';
        const password = 'ASdfgbkiuyf#$56787654:">'; // replace this
        const role = 'client';
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await User_model_1.default.create({
            fullName,
            email,
            password: hashedPassword,
            role,
            isEmailVerified: false
        });
        console.log('✅ User created successfully.');
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Error creating user:', err);
        process.exit(1);
    }
};
createUser();
