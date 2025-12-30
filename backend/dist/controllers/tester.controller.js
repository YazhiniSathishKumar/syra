"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgress = exports.updateVulnerabilities = exports.updateProjectStatus = exports.getAssignedProjects = void 0;
const Project_model_1 = __importDefault(require("../models/Project.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
/**
 * Get all projects (for all testers)
 */
const getAssignedProjects = async (req, res) => {
    try {
        const projects = await Project_model_1.default.findAll({
            include: [
                {
                    model: User_model_1.default,
                    as: 'client', // Changed from 'user' to 'client'
                    attributes: ['id', 'fullName', 'email']
                },
                {
                    model: User_model_1.default,
                    as: 'tester', // Added tester association
                    attributes: ['id', 'fullName', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.getAssignedProjects = getAssignedProjects;
/**
 * Update project status (any tester allowed)
 */
const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'in-progress', 'testing', 'reporting', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid project status' });
        }
        const project = await Project_model_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.update({ status });
        res.json({ message: 'Project status updated', project });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateProjectStatus = updateProjectStatus;
/**
 * Update vulnerability counts (any tester allowed)
 */
const updateVulnerabilities = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { critical, high, medium, low } = req.body;
        const project = await Project_model_1.default.findByPk(projectId);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateVulnerabilities = updateVulnerabilities;
/**
 * Update progress percentage (any tester allowed)
 */
const updateProgress = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { progress } = req.body;
        const progressNum = Number(progress);
        if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
            return res.status(400).json({ message: 'Progress must be between 0 and 100' });
        }
        const project = await Project_model_1.default.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.update({ progress: progressNum });
        res.json({ message: 'Progress updated', project });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
exports.updateProgress = updateProgress;
