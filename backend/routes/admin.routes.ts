import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  getPendingCompanies, 
  verifyCompany,
  getStats,
  adminLogin
} from '../controllers/admin.controller';

const router = Router();

// Admin protected routes
router.get('/pending',getPendingCompanies);
router.post('/verify', verifyCompany);
router.get('/stats', getStats);
router.post('/admin/login', adminLogin);


export default router;