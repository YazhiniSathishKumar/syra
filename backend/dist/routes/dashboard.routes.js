"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Add authentication middleware
router.use(auth_middleware_1.authenticateToken);
// Dashboard routes
router.get('/stats', dashboard_controller_1.getDashboardStats);
router.get('/audits', dashboard_controller_1.getAudits);
router.get('/documents', dashboard_controller_1.getDocuments);
router.get('/notifications', dashboard_controller_1.getNotifications);
exports.default = router;
