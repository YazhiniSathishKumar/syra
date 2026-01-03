"use strict";
// routes/tester.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tester_controller_1 = require("../controllers/tester.controller");
const router = express_1.default.Router();
// GET: Assigned projects
router.get('/projects', tester_controller_1.getAssignedProjects);
// PATCH: Update project status
router.patch('/projects/:projectId/status', tester_controller_1.updateProjectStatus);
// PATCH: Update vulnerabilities
router.patch('/projects/:projectId/vulnerabilities', tester_controller_1.updateVulnerabilities);
// PATCH: Update progress
router.patch('/projects/:projectId/progress', tester_controller_1.updateProgress);
exports.default = router;
