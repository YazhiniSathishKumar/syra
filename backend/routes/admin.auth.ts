// routes/admin.auth.ts
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.model';
import { Request, Response } from 'express';

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const emailMatch = await bcrypt.compare(email, admin.hashedEmail);
    const passwordMatch = await bcrypt.compare(password, admin.hashedPassword);

    if (!emailMatch || !passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT or session logic here
    res.json({ message: 'Admin logged in successfully' });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

