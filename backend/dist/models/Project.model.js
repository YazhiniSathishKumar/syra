"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Project extends sequelize_1.Model {
    async updateVulnerabilities(vulns) {
        const current = this.vulnerabilities;
        const updated = { ...current, ...vulns };
        return this.update({ vulnerabilities: updated });
    }
}
Project.init({
    companyId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Companies',
            key: 'id'
        }
    },
    clientId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        validate: {
            notNull: { msg: 'Client ID is required' }
        }
    },
    testerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [0, 2000]
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'in-progress', 'completed', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
    },
    vulnerabilities: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
        },
        allowNull: false,
        validate: {
            isValidVulnerabilities(value) {
                const requiredFields = ['critical', 'high', 'medium', 'low'];
                for (const field of requiredFields) {
                    if (typeof value[field] !== 'number' || value[field] < 0) {
                        throw new Error(`Vulnerability ${field} must be a positive number`);
                    }
                }
            }
        }
    }
}, {
    sequelize: db_1.default,
    modelName: 'Project',
    indexes: [
        { fields: ['companyId'] },
        { fields: ['clientId'] },
        { fields: ['testerId'] },
        { fields: ['status'] }
    ]
});
exports.default = Project;
