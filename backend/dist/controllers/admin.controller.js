"use strict";
// import { Request, Response } from 'express';
// import Company from '../models/Company.model';
// import Project from '../models/Project.model';
// import User from '../models/User.model';
// import bcrypt from 'bcrypt';
// import Admin from '../models/Admin.model';
// import { generateToken } from '../utils/jwt.utils';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCompany = exports.getStats = exports.getPendingCompanies = exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const Company_model_1 = __importDefault(require("../models/Company.model"));
const Project_model_1 = __importDefault(require("../models/Project.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const jwt_utils_1 = require("../utils/jwt.utils");
// POST /admin/login
// export const adminLogin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const admins = await Admin.findAll(); // No email in DB, fetch all
//     if (admins.length === 0) {
//       return res.status(401).json({ message: 'Unauthorized: Admin not found' });
//     }
//     // Loop through all admins to find matching hashed email
//     const matchedAdmin = admins.find(admin =>
//       bcrypt.compareSync(email, admin.hashedEmail)
//     );
//     if (!matchedAdmin) {
//       return res.status(401).json({ message: 'Invalid email' });
//     }
//     const passwordMatch = await bcrypt.compare(password, matchedAdmin.hashedPassword);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }
//     const token = generateToken({ role: 'admin', id: matchedAdmin.id });
//     return res.status(200).json({
//       message: 'Admin login successful',
//       token,
//       role: 'admin',
//       redirect: '/admin/dashboard'
//     });
//   } catch (err) {
//     console.error('Admin login error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admins = await Admin_model_1.default.findAll(); // No plain email in DB, fetch all admins
        if (admins.length === 0) {
            return res.status(401).json({ message: 'Unauthorized: Admin not found' });
        }
        // Loop through admins to find matching hashed email
        let matchedAdmin = null;
        for (const admin of admins) {
            const isEmailMatch = await bcrypt_1.default.compare(email, admin.hashedEmail);
            if (isEmailMatch) {
                matchedAdmin = admin;
                break;
            }
        }
        if (!matchedAdmin) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, matchedAdmin.hashedPassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = (0, jwt_utils_1.generateToken)({ role: 'admin', id: matchedAdmin.id });
        return res.status(200).json({
            message: 'Admin login successful',
            token,
            role: 'admin',
            redirect: '/admin/dashboard'
        });
    }
    catch (err) {
        console.error('Admin login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.adminLogin = adminLogin;
// GET /admin/companies?status=pending|approved|all
const getPendingCompanies = async (req, res) => {
    try {
        const status = req.query.status;
        const whereClause = status && status !== 'all' ? { status } : {};
        const companies = await Company_model_1.default.findAll({
            where: whereClause,
            include: [{
                    model: User_model_1.default,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email']
                }]
        });
        res.json(companies);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getPendingCompanies = getPendingCompanies;
// GET /admin/stats
const getStats = async (req, res) => {
    try {
        // Calculate total requests
        const totalRequests = await Company_model_1.default.count();
        // Calculate pending requests
        const pendingRequests = await Company_model_1.default.count({
            where: { status: 'pending' },
        });
        // Calculate approved requests
        const approvedRequests = await Company_model_1.default.count({
            where: { status: 'approved' },
        });
        // Calculate active audits (in-progress)
        const activeAudits = await Project_model_1.default.count({
            where: { status: 'pending' }, // or 'in-progress' if that's a valid status
        });
        // Return the statistics
        res.json({
            totalRequests,
            pendingRequests,
            approvedRequests,
            activeAudits,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getStats = getStats;
// POST /admin/verify
const verifyCompany = async (req, res) => {
    try {
        const { companyId, action, notes } = req.body;
        const company = await Company_model_1.default.findByPk(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        if (action === 'approve') {
            await company.update({
                verified: true,
                status: 'approved',
                adminNotes: notes,
            });
            const project = await Project_model_1.default.create({
                companyId: company.id,
                clientId: company.userId,
                name: `${company.companyName} Security Audit`,
                description: `Initial security audit for ${company.companyName}`,
                status: 'pending',
            });
            return res.json({
                message: 'Company approved and project created',
                company,
                project,
            });
        }
        else if (action === 'reject') {
            await company.update({
                verified: false,
                status: 'rejected',
                adminNotes: notes,
            });
            return res.json({ message: 'Company rejected', company });
        }
        return res.status(400).json({ message: 'Invalid action' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.verifyCompany = verifyCompany;
