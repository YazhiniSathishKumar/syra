import { Router } from 'express';
import {
  submitCompanyDetails,
  getCompanyDetails,
  updateCompanyDetails,
} from '../controllers/Company.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();


router.post('/submit-details', submitCompanyDetails);
router.get('/details', getCompanyDetails);
router.put('/update-details', updateCompanyDetails);


export default router;