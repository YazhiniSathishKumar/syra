"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Company extends sequelize_1.Model {
}
Company.init({
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    companyName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Company name cannot be empty'
            },
            len: {
                args: [1, 255],
                msg: 'Company name must be between 1 and 255 characters'
            }
        }
    },
    contactName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Contact name cannot be empty'
            },
            len: {
                args: [1, 100],
                msg: 'Contact name must be between 1 and 100 characters'
            }
        }
    },
    jobRole: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Job role cannot be empty'
            },
            len: {
                args: [1, 100],
                msg: 'Job role must be between 1 and 100 characters'
            }
        }
    },
    contactEmail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please provide a valid email address'
            }
        }
    },
    contactPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            is: {
                args: /^[0-9]{10}$/,
                msg: 'Phone number must be 10 digits'
            }
        }
    },
    companySize: {
        type: sequelize_1.DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']],
                msg: 'Invalid company size'
            }
        }
    },
    industry: {
        type: sequelize_1.DataTypes.ENUM('Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Government', 'Energy', 'Transportation', 'Other'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing',
                        'Education', 'Government', 'Energy', 'Transportation', 'Other']],
                msg: 'Invalid industry'
            }
        }
    },
    auditServices: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        validate: {
            isValidArray(value) {
                if (!Array.isArray(value) || value.length === 0) {
                    throw new Error('At least one audit service must be selected');
                }
                const validServices = ['network', 'web', 'cloud', 'mobile', 'iot', 'api'];
                for (const service of value) {
                    if (!validServices.includes(service)) {
                        throw new Error(`Invalid audit service: ${service}`);
                    }
                }
            }
        }
    },
    additionalDetails: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: {
                args: [0, 2000],
                msg: 'Additional details must not exceed 2000 characters'
            }
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'reviewed', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    adminNotes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    testerNotes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize: db_1.default,
    modelName: 'Company',
    indexes: [
        {
            fields: ['userId']
        },
        {
            fields: ['status']
        },
        {
            fields: ['verified']
        },
        {
            fields: ['industry']
        },
        {
            fields: ['companySize']
        }
    ],
});
exports.default = Company;
