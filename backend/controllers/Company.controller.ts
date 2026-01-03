import { Request, Response } from 'express';
import Company from '../models/Company.model';
import User from '../models/User.model';

// Input validation helpers
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
};

const validatePhone = (phone: string): boolean => {
  return /^[0-9]{7,15}$/.test(phone.trim());
};

const validateCompanySize = (size: string): boolean => {
  const validSizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  return validSizes.includes(size);
};

const validateIndustry = (industry: string): boolean => {
  const validIndustries = [
    'Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing',
    'Education', 'Government', 'Energy', 'Transportation', 'Other'
  ];
  return validIndustries.includes(industry);
};

const validateAuditServices = (services: string[]): boolean => {
  if (!Array.isArray(services) || services.length === 0) return false;
  const validServices = ['network', 'web', 'cloud', 'mobile', 'iot', 'api'];
  return services.every(service => validServices.includes(service));
};

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

// POST /submit-company-details
export const submitCompanyDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      companyName,
      contactName,
      jobRole,
      contactEmail,
      contactPhone,
      companySize,
      industry,
      auditServices,
      additionalDetails
    } = req.body;


    const userId = req.user?.id || req.body.id || req.body.userId;

    // Validation
    if (!userId) {
      res.status(401).json({
        message: 'Authentication or User ID required',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    // Required field validation
    if (!companyName || !contactName || !jobRole || !contactEmail ||
      !contactPhone || !companySize || !industry || !auditServices) {
      res.status(400).json({
        message: 'All required fields must be provided',
        error: 'MISSING_FIELDS'
      });
      return;
    }

    // Format validation
    if (!validateEmail(contactEmail)) {
      res.status(400).json({
        message: 'Invalid email format',
        error: 'INVALID_EMAIL'
      });
      return;
    }

    if (!validatePhone(contactPhone)) {
      res.status(400).json({
        message: 'Invalid phone number format (7-15 digits)',
        error: 'INVALID_PHONE'
      });
      return;
    }

    if (!validateCompanySize(companySize)) {
      res.status(400).json({
        message: 'Invalid company size',
        error: 'INVALID_COMPANY_SIZE'
      });
      return;
    }

    if (!validateIndustry(industry)) {
      res.status(400).json({
        message: 'Invalid industry',
        error: 'INVALID_INDUSTRY'
      });
      return;
    }

    if (!validateAuditServices(auditServices)) {
      res.status(400).json({
        message: 'Invalid audit services selection',
        error: 'INVALID_AUDIT_SERVICES'
      });
      return;
    }

    // Check if user already has a company record
    const existingCompany = await Company.findOne({ where: { userId } });
    if (existingCompany) {
      res.status(409).json({
        message: 'Company details already submitted',
        error: 'COMPANY_EXISTS'
      });
      return;
    }

    // Create company record
    const company = await Company.create({
      userId,
      companyName: companyName.trim(),
      contactName: contactName.trim(),
      jobRole: jobRole.trim(),
      contactEmail: contactEmail.trim().toLowerCase(),
      contactPhone: contactPhone.trim(),
      companySize,
      industry,
      auditServices,
      additionalDetails: additionalDetails?.trim() || '',
      status: 'pending'
    });

    res.status(201).json({
      message: 'Company details submitted successfully',
      company: {
        id: company.id,
        companyName: company.companyName,
        contactName: company.contactName,
        jobRole: company.jobRole,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        companySize: company.companySize,
        industry: company.industry,
        auditServices: company.auditServices,
        additionalDetails: company.additionalDetails,
        status: company.status,
        createdAt: company.createdAt
      }
    });

  } catch (error) {
    console.error('Submit company details error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};

// GET /company-details
export const getCompanyDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    const company = await Company.findOne({
      where: { userId },
      include: [{
        model: User,
        attributes: ['id', 'email', 'fullName']
      }]
    });

    if (!company) {
      res.status(404).json({
        message: 'Company details not found',
        error: 'COMPANY_NOT_FOUND'
      });
      return;
    }

    res.json({
      company: {
        id: company.id,
        companyName: company.companyName,
        contactName: company.contactName,
        jobRole: company.jobRole,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        companySize: company.companySize,
        industry: company.industry,
        auditServices: company.auditServices,
        additionalDetails: company.additionalDetails,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    });

  } catch (error) {
    console.error('Get company details error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};

// PUT /update-company-details
export const updateCompanyDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      companyName,
      contactName,
      jobRole,
      contactEmail,
      contactPhone,
      companySize,
      industry,
      auditServices,
      additionalDetails
    } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    const company = await Company.findOne({ where: { userId } });
    if (!company) {
      res.status(404).json({
        message: 'Company details not found',
        error: 'COMPANY_NOT_FOUND'
      });
      return;
    }

    // Validate if provided
    if (contactEmail && !validateEmail(contactEmail)) {
      res.status(400).json({
        message: 'Invalid email format',
        error: 'INVALID_EMAIL'
      });
      return;
    }

    if (contactPhone && !validatePhone(contactPhone)) {
      res.status(400).json({
        message: 'Invalid phone number format',
        error: 'INVALID_PHONE'
      });
      return;
    }

    if (companySize && !validateCompanySize(companySize)) {
      res.status(400).json({
        message: 'Invalid company size',
        error: 'INVALID_COMPANY_SIZE'
      });
      return;
    }

    if (industry && !validateIndustry(industry)) {
      res.status(400).json({
        message: 'Invalid industry',
        error: 'INVALID_INDUSTRY'
      });
      return;
    }

    if (auditServices && !validateAuditServices(auditServices)) {
      res.status(400).json({
        message: 'Invalid audit services selection',
        error: 'INVALID_AUDIT_SERVICES'
      });
      return;
    }

    // Update fields
    const updateData: any = {};
    if (companyName !== undefined) updateData.companyName = companyName.trim();
    if (contactName !== undefined) updateData.contactName = contactName.trim();
    if (jobRole !== undefined) updateData.jobRole = jobRole.trim();
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail.trim().toLowerCase();
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone.trim();
    if (companySize !== undefined) updateData.companySize = companySize;
    if (industry !== undefined) updateData.industry = industry;
    if (auditServices !== undefined) updateData.auditServices = auditServices;
    if (additionalDetails !== undefined) updateData.additionalDetails = additionalDetails.trim();

    await company.update(updateData);

    res.json({
      message: 'Company details updated successfully',
      company: {
        id: company.id,
        companyName: company.companyName,
        contactName: company.contactName,
        jobRole: company.jobRole,
        contactEmail: company.contactEmail,
        contactPhone: company.contactPhone,
        companySize: company.companySize,
        industry: company.industry,
        auditServices: company.auditServices,
        additionalDetails: company.additionalDetails,
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    });

  } catch (error) {
    console.error('Update company details error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};

