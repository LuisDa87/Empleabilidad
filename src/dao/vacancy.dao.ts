import { Application } from '../models/Application.js';
import { Vacancy } from '../models/Vacancy.js';
import { UserRole } from '../models/User.js';

export const vacancyDao = {
  create(data: Partial<Vacancy>) {
    return Vacancy.create(data as any);
  },

  listForRole(role: UserRole) {
    if (role === 'admin' || role === 'gestor') return Vacancy.findAll();
    return Vacancy.findAll({ where: { isActive: true } });
  },

  findById(id: string) {
    return Vacancy.findByPk(id);
  },

  async updateById(id: string, data: Partial<Vacancy>) {
    await Vacancy.update(data, { where: { id } });
    return this.findById(id);
  },

  countApplications(vacancyId: string) {
    return Application.count({ where: { vacancyId } });
  },
};
