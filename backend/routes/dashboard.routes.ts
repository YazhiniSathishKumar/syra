import { Router } from 'express';
import { 
  getDashboardStats, 
  getAudits, 
  getDocuments, 
  getNotifications 
} from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Add authentication middleware
router.use(authenticateToken);

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/audits', getAudits);
router.get('/documents', getDocuments);
router.get('/notifications', getNotifications);

export default router;