import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import User from '../models/User.model';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        message: 'Access token required', 
        error: 'TOKEN_MISSING' 
      });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'fullName', 'isEmailVerified']
    });

    if (!user) {
      res.status(401).json({ 
        message: 'Invalid token', 
        error: 'INVALID_TOKEN' 
      });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(401).json({ 
        message: 'Email not verified', 
        error: 'EMAIL_NOT_VERIFIED' 
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: 'Invalid token', 
      error: 'TOKEN_INVALID' 
    });
  }
};