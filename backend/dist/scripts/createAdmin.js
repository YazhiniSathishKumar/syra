"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const db_1 = __importDefault(require("../config/db"));
(async () => {
    await db_1.default.sync();
    const email = 'cyapp@bcbuzz.io';
    const password = '67,cL@&.P&3,xt5Xl2#';
    const hashedEmail = await bcrypt_1.default.hash(email, 10);
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const existing = await Admin_model_1.default.findOne(); // only allow 1 admin
    if (!existing) {
        await Admin_model_1.default.create({ email, hashedEmail, hashedPassword });
        console.log('✅ Admin created successfully');
    }
    else {
        console.log('⚠️ Admin already exists');
    }
    process.exit();
})();
