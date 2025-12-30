"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    service: env_1.EMAIL_SERVICE,
    auth: {
        user: env_1.EMAIL_USER,
        pass: env_1.EMAIL_PASS
    }
});
const sendVerificationEmail = async (email, otp) => {
    await transporter.sendMail({
        from: env_1.EMAIL_FROM,
        to: email,
        subject: 'Verify Your Email',
        html: `<h2>Your OTP is: <strong>${otp}</strong></h2>`
    });
};
exports.sendVerificationEmail = sendVerificationEmail;
