"use strict";
// routes/auth.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.post('/signup', auth_controller_1.signup);
router.post('/completeSignup', auth_controller_1.completeSignup);
router.post('/login', auth_controller_1.login);
router.post('/verify-otp', auth_controller_1.verifyOTP);
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.post('/reset-password', auth_controller_1.resetPassword);
exports.default = router;
