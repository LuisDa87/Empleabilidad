import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';
import { Vacancy } from './Vacancy.js';

interface ApplicationAttributes {
  id: string;
  userId: string;
  vacancyId: string;
  appliedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type ApplicationCreationAttributes = Optional<ApplicationAttributes, 'id' | 'appliedAt' | 'createdAt' | 'updatedAt'>;

export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: string;
  public userId!: string;
  public vacancyId!: string;
  public appliedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vacancyId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    appliedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'applications',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'vacancyId'],
      },
    ],
  }
);

// Associations
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'userId', as: 'applicant' });

Vacancy.hasMany(Application, { foreignKey: 'vacancyId', as: 'applications' });
Application.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });

