import { Request, Response } from 'express';
import Company from '../models/Company.model';
import User from '../models/User.model';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// GET /dashboard/stats
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ 
        message: 'Authentication required', 
        error: 'UNAUTHORIZED' 
      });
      return;
    }

    // Get user's company information
    const company = await Company.findOne({ where: { userId } });

    // Mock stats for now - you can implement real logic later
    const stats = {
      totalAudits: company ? 1 : 0,
      completedAudits: 0,
      pendingAudits: company?.status === 'pending' ? 1 : 0,
      criticalFindings: 0,
      companyStatus: company?.status || 'not_submitted',
      lastAuditDate: company?.createdAt || null,
      auditServices: company?.auditServices || []
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: 'SERVER_ERROR' 
    });
  }
};

// GET /dashboard/audits
export const getAudits = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ 
        message: 'Authentication required', 
        error: 'UNAUTHORIZED' 
      });
      return;
    }

    // Get user's company and audit information
    const company = await Company.findOne({ 
      where: { userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'fullName']
      }]
    });

    const audits = company ? [{
      id: company.id,
      type: 'Security Audit Request',
      status: company.status,
      services: company.auditServices,
      companyName: company.companyName,
      requestDate: company.createdAt,
      lastUpdated: company.updatedAt
    }] : [];

    res.json({
      success: true,
      audits,
      total: audits.length
    });

  } catch (error) {
    console.error('Get audits error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: 'SERVER_ERROR' 
    });
  }
};

// GET /dashboard/documents
export const getDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ 
        message: 'Authentication required', 
        error: 'UNAUTHORIZED' 
      });
      return;
    }

    // Mock documents for now - implement real logic later
    const documents = [
      {
        id: 1,
        name: 'Audit Report Template',
        type: 'PDF',
        size: '2.5 MB',
        uploadDate: new Date(),
        status: 'available'
      },
      {
        id: 2,
        name: 'Security Guidelines',
        type: 'PDF',
        size: '1.8 MB',
        uploadDate: new Date(),
        status: 'available'
      }
    ];

    res.json({
      success: true,
      documents,
      total: documents.length
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: 'SERVER_ERROR' 
    });
  }
};

// GET /dashboard/notifications
export const getNotifications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ 
        message: 'Authentication required', 
        error: 'UNAUTHORIZED' 
      });
      return;
    }

    const company = await Company.findOne({ where: { userId } });

    // Mock notifications based on company status
    const notifications = [];
    
    if (company) {
      if (company.status === 'pending') {
        notifications.push({
          id: 1,
          type: 'info',
          title: 'Audit Request Submitted',
          message: 'Your audit request has been submitted and is under review.',
          date: company.createdAt,
          read: false
        });
      } else if (company.status === 'approved') {
        notifications.push({
          id: 1,
          type: 'success',
          title: 'Audit Request Approved',
          message: 'Your audit request has been approved. Our team will contact you soon.',
          date: company.updatedAt,
          read: false
        });
      }
    } else {
      notifications.push({
        id: 1,
        type: 'warning',
        title: 'Complete Your Profile',
        message: 'Please complete your company details to start the audit process.',
        date: new Date(),
        read: false
      });
    }

    res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter(n => !n.read).length
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: 'SERVER_ERROR' 
    });
  }
};