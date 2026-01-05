import { vacancyDao } from '../dao/vacancy.dao.js';
import { Vacancy } from '../models/Vacancy.js';
import { UserRole } from '../models/User.js';

export const vacancyService = {
  list(role: UserRole) {
    return vacancyDao.listForRole(role);
  },

  async create(data: Partial<Vacancy>) {
    if (!data.maxApplicants || data.maxApplicants <= 0) throw new Error('maxApplicants es obligatorio');
    return vacancyDao.create(data);
  },

  async updateMaxApplicants(id: string, maxApplicants: number) {
    const vacancy = await vacancyDao.findById(id);
    if (!vacancy) throw new Error('Vacante no encontrada');
    const current = await vacancyDao.countApplications(id);
    if (maxApplicants < current) throw new Error('El cupo no puede ser menor al número de postulados actuales');
    return vacancyDao.updateById(id, { maxApplicants });
  },

  async setStatus(id: string, isActive: boolean) {
    const vacancy = await vacancyDao.findById(id);
    if (!vacancy) throw new Error('Vacante no encontrada');
    return vacancyDao.updateById(id, { isActive });
  },

  findById(id: string) {
    return vacancyDao.findById(id);
  },
};
