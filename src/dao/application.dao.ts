import { Application } from '../models/Application.js';
import { Vacancy } from '../models/Vacancy.js';

export const applicationDao = {
  create(data: Partial<Application>) {
    return Application.create(data as any);
  },

  findByUserAndVacancy(userId: string, vacancyId: string) {
    return Application.findOne({ where: { userId, vacancyId } });
  },

  countActiveByUser(userId: string) {
    return Application.count({
      where: { userId },
      include: [{ model: Vacancy, as: 'vacancy', where: { isActive: true } }],
    });
  },

  listAll() {
    return Application.findAll({
      include: [
        { model: Vacancy, as: 'vacancy' },
        { association: 'applicant', attributes: ['id', 'name', 'email', 'role'] },
      ],
    });
  },
};
