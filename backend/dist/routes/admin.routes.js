"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
// Admin protected routes
router.get('/pending', admin_controller_1.getPendingCompanies);
router.post('/verify', admin_controller_1.verifyCompany);
router.get('/stats', admin_controller_1.getStats);
router.post('/admin/login', admin_controller_1.adminLogin);
exports.default = router;
