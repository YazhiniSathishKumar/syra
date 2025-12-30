"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const Tester_model_1 = __importDefault(require("../models/Tester.model"));
const db_1 = __importDefault(require("../config/db"));
const createTester = async () => {
    await db_1.default.sync();
    const email = 'lead@cyberxpertz.org';
    const password = 'P&,3x.t5-Xl2.#67,cL@&';
    const fullName = 'CyberXpert Lead';
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const role = 'Tester';
    await Tester_model_1.default.create({
        fullName,
        email,
        hashedPassword,
        role
    });
    console.log('Tester created successfully.');
    process.exit(0);
};
createTester().catch(err => {
    console.error(err);
    process.exit(1);
});
