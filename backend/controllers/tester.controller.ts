import { Request, Response } from 'express';
import Project from '../models/Project.model';
import User from '../models/User.model';

/**
 * Get all projects (for all testers)
 */
export const getAssignedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          as: 'client',  // Changed from 'user' to 'client'
          attributes: ['id', 'fullName', 'email']
        },
        {
          model: User,
          as: 'tester',  // Added tester association
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * Update project status (any tester allowed)
 */
export const updateProjectStatus = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'in-progress', 'testing', 'reporting', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid project status' });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update({ status });

    res.json({ message: 'Project status updated', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * Update vulnerability counts (any tester allowed)
 */
export const updateVulnerabilities = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { critical, high, medium, low } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const currentVulns = project.vulnerabilities || {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    const newVulns = {
      critical: critical !== undefined ? Number(critical) : currentVulns.critical,
      high: high !== undefined ? Number(high) : currentVulns.high,
      medium: medium !== undefined ? Number(medium) : currentVulns.medium,
      low: low !== undefined ? Number(low) : currentVulns.low
    };

    await project.update({ vulnerabilities: newVulns });

    res.json({ message: 'Vulnerabilities updated', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * Update progress percentage (any tester allowed)
 */
export const updateProgress = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { progress } = req.body;

    const progressNum = Number(progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update({ progress: progressNum });

    res.json({ message: 'Progress updated', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
