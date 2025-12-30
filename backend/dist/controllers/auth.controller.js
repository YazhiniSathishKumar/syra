"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.verifyOTP = exports.login = exports.completeSignup = exports.signup = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const OTP_model_1 = __importDefault(require("../models/OTP.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_utils_1 = require("../utils/otp.utils");
const mailer_service_1 = require("../services/mailer.service");
const hash_utils_1 = require("../utils/hash.utils");
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const Tester_model_1 = __importDefault(require("../models/Tester.model"));
// Input validation helpers
const validateEmail = (email) => {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
};
const validatePassword = (password) => {
    return typeof password === 'string' && password.length >= 6;
};
// const validateOTP = (code: any): boolean => {
//   return typeof code === 'string' && /^\d{4,8}$/.test(code.trim());
// };
const validateOTP = (code) => {
    return typeof code === 'string' && /^[A-Za-z0-9]{4,8}$/.test(code.trim());
};
const normalizeEmail = (email) => email.trim().toLowerCase();
// Helper to determine user role
// const getUserRole = (email: string): 'admin' | 'tester' | 'user' => {
//   if (email === 'admin@bcbuzz.io') return 'admin';
//   if (email.endsWith('@cyberxpertz.org')) return 'tester';
//   return 'user';
// };
const getUserRole = (email) => {
    if (email.endsWith('@cyberxpertz.org'))
        return 'tester';
    const deniedDomains = ['@protonmail.com', '@proton.me'];
    if (deniedDomains.some(domain => email.endsWith(domain))) {
        return 'unauthorized';
    }
    const personalDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com'];
    // If it's a personal domain, allow as user
    if (personalDomains.some(domain => email.endsWith(domain))) {
        return 'user';
    }
    // If it contains a domain (business or other), allow as user
    const businessDomainRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (businessDomainRegex.test(email)) {
        return 'user';
    }
    // Otherwise, reject
    return 'unauthorized';
};
// // POST /signup
// export const signup = async (req: Request, res: Response): Promise<void> => {
//   const { fullName, email, password, confirmPassword } = req.body;
//   try {
//     // Validation
//     if (!fullName || !email || !password || !confirmPassword) {
//       res.status(400).json({ message: 'All fields are required', error: 'MISSING_FIELDS' });
//       return;
//     }
//     const normalizedEmail = normalizeEmail(email);
//     if (!validateEmail(normalizedEmail)) {
//       res.status(400).json({ message: 'Invalid email format', error: 'INVALID_EMAIL' });
//       return;
//     }
//     if (!validatePassword(password)) {
//       res.status(400).json({ 
//         message: 'Password must be 6+ characters', 
//         error: 'INVALID_PASSWORD' 
//       });
//       return;
//     }
//     if (password !== confirmPassword) {
//       res.status(400).json({ message: 'Passwords do not match', error: 'PASSWORD_MISMATCH' });
//       return;
//     }
//     // Check existing user
//     const existingUser = await User.findOne({ where: { email: normalizedEmail } });
//     if (existingUser) {
//       res.status(409).json({ message: 'Email already exists', error: 'EMAIL_EXISTS' });
//       return;
//     }
//     // Create user
//     const user = await User.create({ 
//       fullName, 
//       email: normalizedEmail, 
//       password: await hashPassword(password)
//     });
//     // Generate OTP
//     const otp = generateOTP();
//     await OTP.create({ 
//       code: otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
//       userId: user.id,
//       type: 'signup'
//     });
//     await sendVerificationEmail(normalizedEmail, otp);
//     res.status(201).json({ 
//       message: 'OTP sent for verification',
//       userId: user.id
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ 
//       message: 'Internal server error', 
//       error: 'SERVER_ERROR' 
//     });
//   }
// };
const signup = async (req, res) => {
    const { fullName, email, password, confirmPassword } = req.body;
    try {
        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            res.status(400).json({ message: 'All fields are required', error: 'MISSING_FIELDS' });
            return;
        }
        const normalizedEmail = normalizeEmail(email);
        if (!validateEmail(normalizedEmail)) {
            res.status(400).json({ message: 'Invalid email format', error: 'INVALID_EMAIL' });
            return;
        }
        // 🚫 Block ProtonMail domains
        const deniedDomains = ['@protonmail.com', '@proton.me'];
        if (deniedDomains.some(domain => normalizedEmail.endsWith(domain))) {
            res.status(403).json({
                message: 'Signup using ProtonMail is not allowed',
                error: 'UNAUTHORIZED_DOMAIN'
            });
            return;
        }
        if (!validatePassword(password)) {
            res.status(400).json({
                message: 'Password must be 6+ characters',
                error: 'INVALID_PASSWORD'
            });
            return;
        }
        if (password !== confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match', error: 'PASSWORD_MISMATCH' });
            return;
        }
        // Check existing user
        const existingUser = await User_model_1.default.findOne({ where: { email: normalizedEmail } });
        if (existingUser) {
            res.status(409).json({ message: 'Email already exists', error: 'EMAIL_EXISTS' });
            return;
        }
        // Create user
        const user = await User_model_1.default.create({
            fullName,
            email: normalizedEmail,
            password: await (0, hash_utils_1.hashPassword)(password)
        });
        res.status(201).json({
            message: 'Next Get started for verification',
            userId: user.id
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
};
exports.signup = signup;
/// POST /login
// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body;
//   try {
//     // Validation
//     if (!email || !password) {
//       res.status(400).json({ 
//         message: 'Email and password required', 
//         error: 'MISSING_FIELDS' 
//       });
//       return;
//     }
//     const normalizedEmail = normalizeEmail(email);
//     if (!validateEmail(normalizedEmail)) {
//       res.status(400).json({ 
//         message: 'Invalid email format', 
//         error: 'INVALID_EMAIL' 
//       });
//       return;
//     }
//     // // Find user
//     // const user = await User.findOne({ where: { email: normalizedEmail } });
//     // if (!user) {
//     //   res.status(401).json({ 
//     //     message: 'Invalid credentials', 
//     //     error: 'INVALID_CREDENTIALS' 
//     //   });
//     //   return;
//     // }
//     // const isMatch = await comparePassword(password, user.password);
//     // if (!isMatch) {
//     //   res.status(401).json({ 
//     //     message: 'Invalid credentials password', 
//     //     error: 'INVALID_CREDENTIALS' 
//     //   });
//     //   return;
//     // }
//     export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     // Step 1: Admin (hashed email)
//     const admins = await Admin.findAll();
//     let matchedAdmin = null;
//     for (const admin of admins) {
//       const isEmailMatch = await bcrypt.compare(email, admin.hashedEmail);
//       if (isEmailMatch) {
//         matchedAdmin = admin;
//         break;
//       }
//     }
//     if (matchedAdmin) {
//       const isPasswordMatch = await bcrypt.compare(password, matchedAdmin.hashedPassword);
//       if (!isPasswordMatch) {
//         return res.status(401).json({ message: 'Invalid password (admin)' });
//       }
//       const token = generateToken({ id: matchedAdmin.id, role: 'admin' });
//       return res.status(200).json({
//         message: 'Admin login successful',
//         token,
//         role: 'admin',
//         redirect: '/admin/dashboard',
//       });
//     }
//     // Step 2: Tester by domain
//     if (email.endsWith('@cyberxpertz.org')) {
//       const tester = await User.findOne({ where: { email, role: 'tester' } });
//       if (!tester) {
//         return res.status(401).json({ message: 'Tester not found' });
//       }
//       const isTesterPasswordMatch = await bcrypt.compare(password, tester.password);
//       if (!isTesterPasswordMatch) {
//         return res.status(401).json({ message: 'Invalid password (tester)' });
//       }
//       const token = generateToken({ id: tester.id, role: 'tester' });
//       return res.status(200).json({
//         message: 'Tester login successful',
//         token,
//         role: 'tester',
//         redirect: '/tester/dashboard',
//       });
//     }
//     // Step 3: Normal user
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials (user)' });
//     }
//     const isUserPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isUserPasswordMatch) {
//       return res.status(401).json({ message: 'Invalid password (user)' });
//     }
//     const token = generateToken({ id: user.id, role: user.role });
//     return res.status(200).json({
//       message: 'User login successful',
//       token,
//       role: user.role,
//       redirect: `/dashboard/${user.role}`,
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };
//     // Role check
//     const role = getUserRole(user.email);
//     if (role === 'unauthorized') {
//       res.status(403).json({ 
//         message: 'Unauthorized domain', 
//         error: 'UNAUTHORIZED_DOMAIN' 
//       });
//       return;
//     }
//     // Generate OTP
//     await OTP.destroy({ where: { userId: user.id, type: 'login' } }); // Cleanup old OTPs
//     const otp = generateOTP();
//     await OTP.create({
//       code: otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
//       userId: user.id,
//       type: 'login'
//     });
//     await sendVerificationEmail(normalizedEmail, otp);
//     res.json({ 
//       message: `${role.charAt(0).toUpperCase() + role.slice(1)} OTP sent for verification`,
//       requiresOTP: true,
//       email: normalizedEmail,
//       role
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ 
//       message: 'Internal server error', 
//       error: 'SERVER_ERROR' 
//     });
//   }
// };
const completeSignup = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User_model_1.default.findOne({ where: { id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found', error: 'User does not exist' });
        }
        const otp = (0, otp_utils_1.generateOTP)();
        await OTP_model_1.default.create({
            code: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            userId: user.id,
            type: 'signup',
            role: user.role === 'client' ? 'user' : user.role
        });
        await (0, mailer_service_1.sendVerificationEmail)(user.email, otp);
        // ✅ Send success response
        return res.status(200).json({ message: 'OTP sent successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
exports.completeSignup = completeSignup;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        const normalizedEmail = normalizeEmail(email);
        // === Step 1: Admin Login Check ===
        const admins = await Admin_model_1.default.findAll();
        let matchedAdmin = null;
        for (const admin of admins) {
            const isEmailMatch = await bcrypt_1.default.compare(email, admin.hashedEmail);
            if (isEmailMatch) {
                matchedAdmin = admin;
                break;
            }
        }
        if (matchedAdmin) {
            const isPasswordMatch = await bcrypt_1.default.compare(password, matchedAdmin.hashedPassword);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'Invalid password (admin)' });
            }
            const otp = (0, otp_utils_1.generateOTP)();
            await OTP_model_1.default.destroy({ where: { userId: matchedAdmin.id, type: 'login' } });
            await OTP_model_1.default.create({
                code: otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                userId: matchedAdmin.id,
                type: 'login',
                role: 'admin'
            });
            await (0, mailer_service_1.sendVerificationEmail)(email, otp);
            return res.status(200).json({ message: 'Admin OTP sent', requiresOTP: true, email, role: 'admin' });
        }
        // === Step 2: Tester Login ===
        const tester = await Tester_model_1.default.findOne({ where: { email: normalizedEmail } });
        if (tester) {
            const isPasswordMatch = await bcrypt_1.default.compare(password, tester.hashedPassword);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'Invalid password (tester)' });
            }
            const otp = (0, otp_utils_1.generateOTP)();
            await OTP_model_1.default.destroy({ where: { userId: tester.id, type: 'login' } });
            await OTP_model_1.default.create({
                code: otp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                userId: tester.id,
                type: 'login',
                role: 'tester'
            });
            await (0, mailer_service_1.sendVerificationEmail)(tester.email, otp);
            return res.status(200).json({ message: 'Tester OTP sent', requiresOTP: true, email: tester.email, role: 'tester' });
        }
        // === Step 3: Regular User Login ===
        const user = await User_model_1.default.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const isPasswordMatch = await (0, hash_utils_1.comparePassword)(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid password (user)' });
        }
        const otp = (0, otp_utils_1.generateOTP)();
        await OTP_model_1.default.destroy({ where: { userId: user.id, type: 'login' } });
        await OTP_model_1.default.create({
            code: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
            userId: user.id,
            type: 'login',
            role: 'user'
        });
        await (0, mailer_service_1.sendVerificationEmail)(normalizedEmail, otp);
        return res.status(200).json({ message: 'User OTP sent', requiresOTP: true, email: normalizedEmail, role: 'user' });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const verifyOTP = async (req, res) => {
    const { code } = req.body;
    try {
        if (!code || !validateOTP(code)) {
            res.status(400).json({ message: 'Invalid OTP format', error: 'INVALID_OTP' });
            return;
        }
        const otp = await OTP_model_1.default.findOne({
            where: { code: code.trim() },
            order: [['createdAt', 'DESC']]
        });
        if (!otp || otp.expiresAt < new Date()) {
            res.status(401).json({
                message: 'Invalid or expired OTP',
                error: 'OTP_INVALID'
            });
            return;
        }
        // ✅ Dynamically check based on role
        let user = null;
        if (otp.role === 'admin') {
            user = await Admin_model_1.default.findByPk(otp.userId);
        }
        else if (otp.role === 'user' || otp.role === 'client') {
            user = await User_model_1.default.findByPk(otp.userId);
        }
        else if (otp.role === 'tester') {
            user = await Tester_model_1.default.findByPk(otp.userId);
        }
        if (!user) {
            res.status(404).json({ message: 'User not found for OTP', error: 'USER_NOT_FOUND' });
            return;
        }
        // ✅ For User and Tester: mark email verified
        if ((otp.role === 'user' || otp.role === 'tester') && !user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
        }
        await otp.destroy();
        const token = (0, jwt_utils_1.generateToken)({ id: user.id, role: otp.role });
        // ✅ Set secure HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // true only on HTTPS
            sameSite: 'none', // required for cross-origin cookies
            maxAge: 3600000 // optional: 1 hour (match your JWT)
        });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName || (otp.role === 'admin' ? 'Administrator' : 'User'),
                isEmailVerified: true,
                role: otp.role
            }
        });
    }
    catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
};
exports.verifyOTP = verifyOTP;
// POST /forgot-password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email || !validateEmail(normalizeEmail(email))) {
            res.status(400).json({ message: 'Valid email required', error: 'INVALID_EMAIL' });
            return;
        }
        const normalizedEmail = normalizeEmail(email);
        const user = await User_model_1.default.findOne({ where: { email: normalizedEmail } });
        if (user) {
            // Cleanup old OTPs
            await OTP_model_1.default.destroy({ where: { userId: user.id, type: 'password_reset' } });
            // Generate OTP
            const otp = (0, otp_utils_1.generateOTP)();
            await OTP_model_1.default.create({
                code: otp,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
                userId: user.id,
                type: 'password_reset'
            });
            await (0, mailer_service_1.sendVerificationEmail)(normalizedEmail, otp);
        }
        // Always return success to prevent email enumeration
        res.json({ message: 'If the email exists, a reset OTP was sent' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
};
exports.forgotPassword = forgotPassword;
// POST /reset-password
const resetPassword = async (req, res) => {
    const { email, code, newPassword, confirmPassword } = req.body;
    try {
        // Validation
        if (!email || !code || !newPassword || !confirmPassword) {
            res.status(400).json({ message: 'All fields required', error: 'MISSING_FIELDS' });
            return;
        }
        const normalizedEmail = normalizeEmail(email);
        if (!validateEmail(normalizedEmail)) {
            res.status(400).json({ message: 'Invalid email', error: 'INVALID_EMAIL' });
            return;
        }
        if (!validatePassword(newPassword)) {
            res.status(400).json({
                message: 'Password must be 6+ characters',
                error: 'INVALID_PASSWORD'
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            res.status(400).json({ message: 'Passwords do not match', error: 'PASSWORD_MISMATCH' });
            return;
        }
        // Find user and OTP
        const user = await User_model_1.default.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
            return;
        }
        const otp = await OTP_model_1.default.findOne({
            where: {
                userId: user.id,
                code: code.trim(),
                type: 'password_reset'
            },
            order: [['createdAt', 'DESC']]
        });
        if (!otp || otp.expiresAt < new Date()) {
            res.status(401).json({
                message: 'Invalid or expired OTP',
                error: 'OTP_INVALID'
            });
            return;
        }
        // Update password
        user.password = await (0, hash_utils_1.hashPassword)(newPassword);
        await user.save();
        // Cleanup OTP
        await otp.destroy();
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: 'SERVER_ERROR'
        });
    }
};
exports.resetPassword = resetPassword;
