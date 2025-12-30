// routes/tester.routes.ts

import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getAssignedProjects,
  updateProjectStatus,
  updateVulnerabilities,
  updateProgress
} from '../controllers/tester.controller';

const router = express.Router();

// GET: Assigned projects
router.get('/projects', getAssignedProjects);

// PATCH: Update project status
router.patch('/projects/:projectId/status', updateProjectStatus);

// PATCH: Update vulnerabilities
router.patch('/projects/:projectId/vulnerabilities', updateVulnerabilities);

// PATCH: Update progress
router.patch('/projects/:projectId/progress', updateProgress);

export default router;