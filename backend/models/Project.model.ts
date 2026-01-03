import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Project extends Model {
  public id!: number;
  public companyId!: number;
  public clientId!: number;
  public testerId!: number | null;
  public name!: string;
  public description!: string;
  public status!: 'pending' | 'in-progress' | 'completed' | 'rejected';
  public vulnerabilities!: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async updateVulnerabilities(vulns: Partial<this['vulnerabilities']>) {
    const current = this.vulnerabilities;
    const updated = { ...current, ...vulns };
    return this.update({ vulnerabilities: updated });
  }
}

Project.init(
  {
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id'
      }
    },
    clientId: {
  type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 2000]
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    vulnerabilities: {
      type: DataTypes.JSON,
      defaultValue: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      allowNull: false,
      validate: {
        isValidVulnerabilities(value: any) {
          const requiredFields = ['critical', 'high', 'medium', 'low'];
          for (const field of requiredFields) {
            if (typeof value[field] !== 'number' || value[field] < 0) {
              throw new Error(`Vulnerability ${field} must be a positive number`);
            }
          }
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Project',
    indexes: [
      { fields: ['companyId'] },
      { fields: ['clientId'] },
      { fields: ['testerId'] },
      { fields: ['status'] }
    ]
  }
);

export default Project;
