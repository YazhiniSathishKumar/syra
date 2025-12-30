// import { Request, Response } from 'express';
// import Company from '../models/Company.model';
// import Project from '../models/Project.model';
// import User from '../models/User.model';
// import bcrypt from 'bcrypt';
// import Admin from '../models/Admin.model';
// import { generateToken } from '../utils/jwt.utils';


// export const adminLogin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await Admin.findOne({ where: { email } });
//     if (!admin) {
//       return res.status(401).json({ message: 'Unauthorized: Admin not found' });
//     }

//     const passwordMatch = await bcrypt.compare(password, admin.hashedPassword);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = generateToken({ role: 'admin', id: admin.id });

//     return res.status(200).json({
//       message: 'Admin login successful',
//       token,
//       role: 'admin',
//       redirect: '/admin/dashboard'
//     });
//   } catch (err) {
//     console.error('Admin login error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// export const getStats = async (req: Request, res: Response) => {
//   try {
//     // Calculate total requests
//     const totalRequests = await Company.count();

//     // Calculate pending requests
//     const pendingRequests = await Company.count({
//       where: { status: 'pending' },
//     });

//     // Calculate approved requests
//     const approvedRequests = await Company.count({
//       where: { status: 'approved' },
//     });

//     // Calculate active audits (in-progress)
//     const activeAudits = await Company.count({
//       where: { status: 'approved' },
//     });

//     // Return the statistics
//     res.json({
//       totalRequests,
//       pendingRequests,
//       approvedRequests,
//       activeAudits,
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const getPendingCompanies = async (req: Request, res: Response) => {
//   try {
//     const status = req.query.status as string;

//     // Only apply filter if status is not 'all'
//     const whereClause = status && status !== 'all' ? { status } : {};

//     const companies = await Company.findAll({
//       where: whereClause,
//       include: [{
//         model: User,
//         as: 'user',
//         attributes: ['id']
//       }]
//     });

//     res.json(companies);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// export const verifyCompany = async (req: Request, res: Response) => {
//   try {
//     const { companyId, action, notes } = req.body;
    
//     const company = await Company.findByPk(companyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     if (action === 'approve') {
//       await company.update({
//         verified: true,
//         status: 'approved',
//         adminNotes: notes
//       });

//       // Create a new project for the tester
//      const project = await Project.create({
//   companyId: company.id,
//   clientId: company.userId, // Add this line using the company's owner as client
//   name: `${company.companyName} Security Audit`,
//   description: `Initial security audit for ${company.companyName}`,
//   status: 'pending'
// });

//       return res.json({ 
//         message: 'Company approved and project created',
//         company,
//         project 
//       });
//     } else if (action === 'reject') {
//       await company.update({
//         verified: false,
//         status: 'rejected',
//         adminNotes: notes
//       });
//       return res.json({ message: 'Company rejected', company });
//     }

//     res.status(400).json({ message: 'Invalid action' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.model';
import Company from '../models/Company.model';
import Project from '../models/Project.model';
import User from '../models/User.model';
import { generateToken } from '../utils/jwt.utils';

// POST /admin/login

// export const adminLogin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const admins = await Admin.findAll(); // No email in DB, fetch all
//     if (admins.length === 0) {
//       return res.status(401).json({ message: 'Unauthorized: Admin not found' });
//     }

//     // Loop through all admins to find matching hashed email
//     const matchedAdmin = admins.find(admin =>
//       bcrypt.compareSync(email, admin.hashedEmail)
//     );

//     if (!matchedAdmin) {
//       return res.status(401).json({ message: 'Invalid email' });
//     }

//     const passwordMatch = await bcrypt.compare(password, matchedAdmin.hashedPassword);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     const token = generateToken({ role: 'admin', id: matchedAdmin.id });

//     return res.status(200).json({
//       message: 'Admin login successful',
//       token,
//       role: 'admin',
//       redirect: '/admin/dashboard'
//     });
//   } catch (err) {
//     console.error('Admin login error:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };



export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admins = await Admin.findAll(); // No plain email in DB, fetch all admins

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Unauthorized: Admin not found' });
    }

    // Loop through admins to find matching hashed email
    let matchedAdmin = null;
    for (const admin of admins) {
      const isEmailMatch = await bcrypt.compare(email, admin.hashedEmail);
      if (isEmailMatch) {
        matchedAdmin = admin;
        break;
      }
    }

    if (!matchedAdmin) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isPasswordValid = await bcrypt.compare(password, matchedAdmin.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken({ role: 'admin', id: matchedAdmin.id });

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      role: 'admin',
      redirect: '/admin/dashboard'
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// GET /admin/companies?status=pending|approved|all
export const getPendingCompanies = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const whereClause = status && status !== 'all' ? { status } : {};

    const companies = await Company.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email']
      }]
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET /admin/stats
export const getStats = async (req: Request, res: Response) => {
  try {
    // Calculate total requests
    const totalRequests = await Company.count();

    // Calculate pending requests
    const pendingRequests = await Company.count({
      where: { status: 'pending' },
    });

    // Calculate approved requests
    const approvedRequests = await Company.count({
      where: { status: 'approved' },
    });

    // Calculate active audits (in-progress)
    const activeAudits = await Project.count({
      where: { status: 'pending' }, // or 'in-progress' if that's a valid status
    });

    // Return the statistics
    res.json({
      totalRequests,
      pendingRequests,
      approvedRequests,
      activeAudits,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// POST /admin/verify
export const verifyCompany = async (req: Request, res: Response) => {
  try {
    const { companyId, action, notes } = req.body;

    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (action === 'approve') {
      await company.update({
        verified: true,
        status: 'approved',
        adminNotes: notes,
      });

      const project = await Project.create({
        companyId: company.id,
        clientId: company.userId,
        name: `${company.companyName} Security Audit`,
        description: `Initial security audit for ${company.companyName}`,
        status: 'pending',
      });

      return res.json({
        message: 'Company approved and project created',
        company,
        project,
      });
    } else if (action === 'reject') {
      await company.update({
        verified: false,
        status: 'rejected',
        adminNotes: notes,
      });

      return res.json({ message: 'Company rejected', company });
    }

    return res.status(400).json({ message: 'Invalid action' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
