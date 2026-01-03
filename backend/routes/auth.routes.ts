// routes/auth.routes.ts

import { Router } from 'express';
import {
  signup,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  completeSignup,
  resendOTP,
  logout
} from '../controllers/auth.controller';


const router = Router();

router.post('/signup', signup);
router.post('/completeSignup', completeSignup);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);
router.post('/logout', logout);

export default router;