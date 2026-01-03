import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

class Company extends Model {
  public id!: number;
  public userId!: number;
  public companyName!: string;
  public contactName!: string;
  public jobRole!: string;
  public contactEmail!: string;
  public contactPhone!: string;
  public companySize!: string;
  public industry!: string;
  public auditServices!: string;
  public additionalDetails!: string;
  public status!: 'pending' | 'reviewed' | 'approved' | 'rejected';
  public verified!: boolean;
  public adminNotes!: string | null;
  public testerNotes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    companyName: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
    contactPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[0-9]{7,15}$/,
          msg: 'Phone number must be between 7 and 15 digits'
        }
      }
    },
    companySize: {
      type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']],
          msg: 'Invalid company size'
        }
      }
    },
    industry: {
      type: DataTypes.ENUM(
        'Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing',
        'Education', 'Government', 'Energy', 'Transportation', 'Other'
      ),
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
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidArray(value: any) {
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
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Additional details must not exceed 2000 characters'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    testerNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
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

  }
);

export default Company;