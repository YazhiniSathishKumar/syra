import { Request, Response } from 'express';
import User from '../models/User.model';
import OTP from '../models/OTP.model';
import { generateToken } from '../utils/jwt.utils';
import bcrypt from 'bcrypt';
import { generateOTP } from '../utils/otp.utils';
import { sendVerificationEmail } from '../services/mailer.service';
import { hashPassword, comparePassword } from '../utils/hash.utils';
import Admin from '../models/Admin.model';
import Tester from '../models/Tester.model';


// Input validation helpers
const validateEmail = (email: any): boolean => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
};

const validatePassword = (password: any): boolean => {
  return typeof password === 'string' && password.length >= 6;
};

// const validateOTP = (code: any): boolean => {
//   return typeof code === 'string' && /^\d{4,8}$/.test(code.trim());
// };

const validateOTP = (code: any): boolean => {
  return typeof code === 'string' && /^[A-Za-z0-9]{4,8}$/.test(code.trim());
};


const normalizeEmail = (email: string): string => email.trim().toLowerCase();

// Helper to determine user role
// const getUserRole = (email: string): 'admin' | 'tester' | 'user' => {
//   if (email === 'admin@bcbuzz.io') return 'admin';
//   if (email.endsWith('@cyberxpertz.org')) return 'tester';
//   return 'user';
// };

const getUserRole = (email: string): 'admin' | 'tester' | 'user' | 'unauthorized' => {
  if (email.endsWith('@cyberxpertz.org')) return 'tester';

  const deniedDomains = ['@protonmail.com', '@proton.me'];
  if (deniedDomains.some(domain => email.endsWith(domain))) {
    return 'unauthorized';
  }

  const personalDomains = ['@gmail.com', '@yahoo.com', '@outlook.com', '@hotmail.com'];

  // If it's a personal domain, allow as user
  if (personalDomains.some(domain => email.endsWith(domain))) {
    return 'user';
  }

  // If it contains a domain (business or other), allow as user
  const businessDomainRegex = /^[^@]+@[^@]+\.[^@]+$/;
  if (businessDomainRegex.test(email)) {
    return 'user';
  }

  // Otherwise, reject
  return 'unauthorized';
};



// // POST /signup
// export const signup = async (req: Request, res: Response): Promise<void> => {
//   const { fullName, email, password, confirmPassword } = req.body;

//   try {
//     // Validation
//     if (!fullName || !email || !password || !confirmPassword) {
//       res.status(400).json({ message: 'All fields are required', error: 'MISSING_FIELDS' });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);
//     if (!validateEmail(normalizedEmail)) {
//       res.status(400).json({ message: 'Invalid email format', error: 'INVALID_EMAIL' });
//       return;
//     }

//     if (!validatePassword(password)) {
//       res.status(400).json({ 
//         message: 'Password must be 6+ characters', 
//         error: 'INVALID_PASSWORD' 
//       });
//       return;
//     }

//     if (password !== confirmPassword) {
//       res.status(400).json({ message: 'Passwords do not match', error: 'PASSWORD_MISMATCH' });
//       return;
//     }

//     // Check existing user
//     const existingUser = await User.findOne({ where: { email: normalizedEmail } });
//     if (existingUser) {
//       res.status(409).json({ message: 'Email already exists', error: 'EMAIL_EXISTS' });
//       return;
//     }

//     // Create user
//     const user = await User.create({ 
//       fullName, 
//       email: normalizedEmail, 
//       password: await hashPassword(password)
//     });

//     // Generate OTP
//     const otp = generateOTP();
//     await OTP.create({ 
//       code: otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
//       userId: user.id,
//       type: 'signup'
//     });

//     await sendVerificationEmail(normalizedEmail, otp);

//     res.status(201).json({ 
//       message: 'OTP sent for verification',
//       userId: user.id
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ 
//       message: 'Internal server error', 
//       error: 'SERVER_ERROR' 
//     });
//   }
// };


export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password, confirmPassword } = req.body;

  try {
    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      res.status(400).json({ message: 'All fields are required', error: 'MISSING_FIELDS' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
      res.status(400).json({ message: 'Invalid email format', error: 'INVALID_EMAIL' });
      return;
    }

    // 🚫 Block ProtonMail domains
    const deniedDomains = ['@protonmail.com', '@proton.me'];
    if (deniedDomains.some(domain => normalizedEmail.endsWith(domain))) {
      res.status(403).json({
        message: 'Signup using ProtonMail is not allowed',
        error: 'UNAUTHORIZED_DOMAIN'
      });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({
        message: 'Password must be 6+ characters',
        error: 'INVALID_PASSWORD'
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match', error: 'PASSWORD_MISMATCH' });
      return;
    }

    // Check existing user
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      res.status(409).json({ message: 'Email already exists', error: 'EMAIL_EXISTS' });
      return;
    }

    // Create user
    const role = getUserRole(normalizedEmail);
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: await hashPassword(password),
      role: role === 'unauthorized' ? 'user' : role
    });

    res.status(201).json({
      message: 'Next Get started for verification',
      userId: user.id
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};



/// POST /login
// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body;

//   try {
//     // Validation
//     if (!email || !password) {
//       res.status(400).json({ 
//         message: 'Email and password required', 
//         error: 'MISSING_FIELDS' 
//       });
//       return;
//     }

//     const normalizedEmail = normalizeEmail(email);
//     if (!validateEmail(normalizedEmail)) {
//       res.status(400).json({ 
//         message: 'Invalid email format', 
//         error: 'INVALID_EMAIL' 
//       });
//       return;
//     }

//     // // Find user
//     // const user = await User.findOne({ where: { email: normalizedEmail } });
//     // if (!user) {
//     //   res.status(401).json({ 
//     //     message: 'Invalid credentials', 
//     //     error: 'INVALID_CREDENTIALS' 
//     //   });
//     //   return;
//     // }

//     // const isMatch = await comparePassword(password, user.password);
//     // if (!isMatch) {
//     //   res.status(401).json({ 
//     //     message: 'Invalid credentials password', 
//     //     error: 'INVALID_CREDENTIALS' 
//     //   });
//     //   return;
//     // }


//     export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     // Step 1: Admin (hashed email)
//     const admins = await Admin.findAll();
//     let matchedAdmin = null;
//     for (const admin of admins) {
//       const isEmailMatch = await bcrypt.compare(email, admin.hashedEmail);
//       if (isEmailMatch) {
//         matchedAdmin = admin;
//         break;
//       }
//     }

//     if (matchedAdmin) {
//       const isPasswordMatch = await bcrypt.compare(password, matchedAdmin.hashedPassword);
//       if (!isPasswordMatch) {
//         return res.status(401).json({ message: 'Invalid password (admin)' });
//       }

//       const token = generateToken({ id: matchedAdmin.id, role: 'admin' });
//       return res.status(200).json({
//         message: 'Admin login successful',
//         token,
//         role: 'admin',
//         redirect: '/admin/dashboard',
//       });
//     }

//     // Step 2: Tester by domain
//     if (email.endsWith('@cyberxpertz.org')) {
//       const tester = await User.findOne({ where: { email, role: 'tester' } });
//       if (!tester) {
//         return res.status(401).json({ message: 'Tester not found' });
//       }

//       const isTesterPasswordMatch = await bcrypt.compare(password, tester.password);
//       if (!isTesterPasswordMatch) {
//         return res.status(401).json({ message: 'Invalid password (tester)' });
//       }

//       const token = generateToken({ id: tester.id, role: 'tester' });
//       return res.status(200).json({
//         message: 'Tester login successful',
//         token,
//         role: 'tester',
//         redirect: '/tester/dashboard',
//       });
//     }

//     // Step 3: Normal user
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials (user)' });
//     }

//     const isUserPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isUserPasswordMatch) {
//       return res.status(401).json({ message: 'Invalid password (user)' });
//     }

//     const token = generateToken({ id: user.id, role: user.role });
//     return res.status(200).json({
//       message: 'User login successful',
//       token,
//       role: user.role,
//       redirect: `/dashboard/${user.role}`,
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };



//     // Role check
//     const role = getUserRole(user.email);
//     if (role === 'unauthorized') {
//       res.status(403).json({ 
//         message: 'Unauthorized domain', 
//         error: 'UNAUTHORIZED_DOMAIN' 
//       });
//       return;
//     }

//     // Generate OTP
//     await OTP.destroy({ where: { userId: user.id, type: 'login' } }); // Cleanup old OTPs

//     const otp = generateOTP();
//     await OTP.create({
//       code: otp,
//       expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
//       userId: user.id,
//       type: 'login'
//     });

//     await sendVerificationEmail(normalizedEmail, otp);

//     res.json({ 
//       message: `${role.charAt(0).toUpperCase() + role.slice(1)} OTP sent for verification`,
//       requiresOTP: true,
//       email: normalizedEmail,
//       role
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ 
//       message: 'Internal server error', 
//       error: 'SERVER_ERROR' 
//     });
//   }
// };
export const completeSignup = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(401).json({ message: 'User not found', error: 'User does not exist' });
    }

    const otp = generateOTP();

    // Clean up old OTPs for this user/role
    await OTP.destroy({ where: { userId: user.id, role: user.role === 'client' ? 'user' : user.role, type: 'signup' } });

    await OTP.create({
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      userId: user.id,
      type: 'signup',
      role: user.role === 'client' ? 'user' : user.role
    });

    await sendVerificationEmail(user.email, otp);

    // ✅ Send success response
    return res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error });
  }
};


export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email, type = 'signup' } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        error: 'MISSING_EMAIL'
      });
    }

    const normalizedEmail = normalizeEmail(email);

    // Find user across all roles
    let user: any = null;
    let role: string = '';

    // Step 1: Check User
    user = await User.findOne({ where: { email: normalizedEmail } });
    if (user) {
      role = 'user';
    } else {
      // Step 2: Check Tester
      user = await Tester.findOne({ where: { email: normalizedEmail } });
      if (user) {
        role = 'tester';
      } else {
        // Step 3: Check Admin (special case since email is plain in DB now based on Model view, but login uses hashedEmail check)
        // Wait, Admin.model.ts has 'email' field as unique and NOT NULL. 
        user = await Admin.findOne({ where: { email: normalizedEmail } });
        if (user) {
          role = 'admin';
        }
      }
    }

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Clean up old OTPs of the same type for this user/role
    await OTP.destroy({ where: { userId: user.id, type, role } });

    // Generate new OTP
    const otp = generateOTP();
    await OTP.create({
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      userId: user.id,
      type: type as any,
      role: role as any
    });

    await sendVerificationEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: `OTP (${type}) resent successfully`,
      email: normalizedEmail
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = normalizeEmail(email);

    // === Step 1: Admin Login Check ===
    const admins = await Admin.findAll();
    let matchedAdmin = null;

    for (const admin of admins) {
      const isEmailMatch = await bcrypt.compare(email, admin.hashedEmail);
      if (isEmailMatch) {
        matchedAdmin = admin;
        break;
      }
    }

    if (matchedAdmin) {
      const isPasswordMatch = await bcrypt.compare(password, matchedAdmin.hashedPassword);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid password (admin)' });
      }

      const otp = generateOTP();
      await OTP.destroy({ where: { userId: matchedAdmin.id, type: 'login', role: 'admin' } });
      await OTP.create({
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        userId: matchedAdmin.id,
        type: 'login',
        role: 'admin'
      });
      await sendVerificationEmail(email, otp);
      return res.status(200).json({ message: 'Admin OTP sent', requiresOTP: true, email, role: 'admin' });
    }

    // === Step 2: Tester Login ===
    const tester = await Tester.findOne({ where: { email: normalizedEmail } });
    if (tester) {
      const isPasswordMatch = await bcrypt.compare(password, tester.hashedPassword);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid password (tester)' });
      }

      const otp = generateOTP();
      await OTP.destroy({ where: { userId: tester.id, type: 'login', role: 'tester' } });
      await OTP.create({
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        userId: tester.id,
        type: 'login',
        role: 'tester'
      });
      await sendVerificationEmail(tester.email, otp);
      return res.status(200).json({ message: 'Tester OTP sent', requiresOTP: true, email: tester.email, role: 'tester' });
    }

    // === Step 3: Regular User Login ===
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password (user)' });
    }

    const otp = generateOTP();
    await OTP.destroy({ where: { userId: user.id, type: 'login', role: 'user' } });
    await OTP.create({
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      userId: user.id,
      type: 'login',
      role: 'user'
    });
    await sendVerificationEmail(normalizedEmail, otp);
    return res.status(200).json({ message: 'User OTP sent', requiresOTP: true, email: normalizedEmail, role: 'user' });


  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};






export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;

  try {
    if (!email || !code || !validateOTP(code)) {
      res.status(400).json({ message: 'Email and valid OTP code are required', error: 'INVALID_INPUT' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    // Find user across all roles to get the correct userId and role
    let foundUser: any = null;
    let detectedRole: string = '';

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (user) {
      foundUser = user;
      detectedRole = 'user';
    } else {
      const tester = await Tester.findOne({ where: { email: normalizedEmail } });
      if (tester) {
        foundUser = tester;
        detectedRole = 'tester';
      } else {
        const admin = await Admin.findOne({ where: { email: normalizedEmail } });
        if (admin) {
          foundUser = admin;
          detectedRole = 'admin';
        }
      }
    }

    if (!foundUser) {
      res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
      return;
    }

    // Find the latest valid OTP for this specific user and role
    const otp = await OTP.findOne({
      where: {
        code: code.trim(),
        userId: foundUser.id,
        role: detectedRole
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otp || otp.expiresAt < new Date()) {
      res.status(401).json({
        message: 'Invalid or expired OTP',
        error: 'OTP_INVALID'
      });
      return;
    }

    // ✅ For User and Tester: mark email verified if not already
    if ((detectedRole === 'user' || detectedRole === 'tester') && !foundUser.isEmailVerified) {
      foundUser.isEmailVerified = true;
      await foundUser.save();
    }

    // Cleanup the used OTP
    await otp.destroy();

    const token = generateToken({ id: foundUser.id, role: detectedRole });

    // ✅ Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,       // true only on HTTPS
      sameSite: 'none',   // required for cross-origin cookies
      maxAge: 3600000     // 1 hour
    });

    res.json({
      token,
      user: {
        id: foundUser.id,
        email: normalizedEmail,
        fullName: foundUser.fullName || (detectedRole === 'admin' ? 'Administrator' : 'User'),
        isEmailVerified: true,
        role: detectedRole
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};





// POST /forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    if (!email || !validateEmail(normalizeEmail(email))) {
      res.status(400).json({ message: 'Valid email required', error: 'INVALID_EMAIL' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    // Find user across all roles
    let foundUser: any = null;
    let detectedRole: string = '';

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (user) {
      foundUser = user;
      detectedRole = 'user';
    } else {
      const tester = await Tester.findOne({ where: { email: normalizedEmail } });
      if (tester) {
        foundUser = tester;
        detectedRole = 'tester';
      } else {
        const admin = await Admin.findOne({ where: { email: normalizedEmail } });
        if (admin) {
          foundUser = admin;
          detectedRole = 'admin';
        }
      }
    }

    if (foundUser) {
      // Cleanup old OTPs
      await OTP.destroy({ where: { userId: foundUser.id, role: detectedRole, type: 'password_reset' } });

      // Generate OTP
      const otp = generateOTP();
      await OTP.create({
        code: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        userId: foundUser.id,
        role: detectedRole as any,
        type: 'password_reset'
      });

      await sendVerificationEmail(normalizedEmail, otp);
    }

    // Always return success to prevent email enumeration
    res.json({ message: 'If the email exists, a reset OTP was sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};

// POST /reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email, code, newPassword, confirmPassword } = req.body;

  try {
    // Validation
    if (!email || !code || !newPassword || !confirmPassword) {
      res.status(400).json({ message: 'All fields required', error: 'MISSING_FIELDS' });
      return;
    }

    const normalizedEmail = normalizeEmail(email);
    if (!validateEmail(normalizedEmail)) {
      res.status(400).json({ message: 'Invalid email', error: 'INVALID_EMAIL' });
      return;
    }

    if (!validatePassword(newPassword)) {
      res.status(400).json({
        message: 'Password must be 6+ characters',
        error: 'INVALID_PASSWORD'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match', error: 'PASSWORD_MISMATCH' });
      return;
    }

    // Find user and OTP across all roles
    let foundUser: any = null;
    let detectedRole: string = '';

    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (user) {
      foundUser = user;
      detectedRole = 'user';
    } else {
      const tester = await Tester.findOne({ where: { email: normalizedEmail } });
      if (tester) {
        foundUser = tester;
        detectedRole = 'tester';
      } else {
        const admin = await Admin.findOne({ where: { email: normalizedEmail } });
        if (admin) {
          foundUser = admin;
          detectedRole = 'admin';
        }
      }
    }

    if (!foundUser) {
      res.status(404).json({ message: 'User not found', error: 'USER_NOT_FOUND' });
      return;
    }

    const otp = await OTP.findOne({
      where: {
        userId: foundUser.id,
        role: detectedRole,
        code: code.trim(),
        type: 'password_reset'
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otp || otp.expiresAt < new Date()) {
      res.status(401).json({
        message: 'Invalid or expired OTP',
        error: 'OTP_INVALID'
      });
      return;
    }

    // Update password
    if (detectedRole === 'admin') {
      foundUser.hashedPassword = await bcrypt.hash(newPassword, 10);
    } else if (detectedRole === 'tester') {
      foundUser.hashedPassword = await hashPassword(newPassword);
    } else {
      foundUser.password = await hashPassword(newPassword); // User model uses '.password' and '.hashedPassword' in some places? No, User.model.ts uses 'password'.
    }
    await foundUser.save();

    // Cleanup OTP
    await otp.destroy();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Server error during logout' });
  }
};