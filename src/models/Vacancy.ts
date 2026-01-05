import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export type Modality = 'remoto' | 'hibrido' | 'presencial';

interface VacancyAttributes {
  id: string;
  title: string;
  description: string;
  technologies: string;
  seniority: string;
  softSkills: string;
  location: string;
  modality: Modality;
  salaryRange: string;
  company: string;
  maxApplicants: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type VacancyCreationAttributes = Optional<VacancyAttributes, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>;

export class Vacancy extends Model<VacancyAttributes, VacancyCreationAttributes> implements VacancyAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public technologies!: string;
  public seniority!: string;
  public softSkills!: string;
  public location!: string;
  public modality!: Modality;
  public salaryRange!: string;
  public company!: string;
  public maxApplicants!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vacancy.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    technologies: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    seniority: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    softSkills: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    modality: {
      type: DataTypes.ENUM('remoto', 'hibrido', 'presencial'),
      allowNull: false,
    },
    salaryRange: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    maxApplicants: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'vacancies',
  }
);

