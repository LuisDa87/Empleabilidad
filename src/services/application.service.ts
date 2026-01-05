import { applicationDao } from '../dao/application.dao.js';
import { vacancyDao } from '../dao/vacancy.dao.js';

export const applicationService = {
  async apply(userId: string, vacancyId: string) {
    const vacancy = await vacancyDao.findById(vacancyId);
    if (!vacancy || !vacancy.isActive) throw new Error('La vacante no está disponible');

    const alreadyApplied = await applicationDao.findByUserAndVacancy(userId, vacancyId);
    if (alreadyApplied) throw new Error('Ya estás postulado a esta vacante');

    const vacancyCount = await vacancyDao.countApplications(vacancyId);
    if (vacancyCount >= vacancy.maxApplicants) throw new Error('El cupo de la vacante está completo');

    // acá corto si ya tiene 3 activas, no dejo ni crear el registro
    const activeApplications = await applicationDao.countActiveByUser(userId);
    if (activeApplications >= 3) throw new Error('No puedes postularte a más de tres vacantes activas');

    return applicationDao.create({ userId, vacancyId });
  },

  listAll() {
    return applicationDao.listAll();
  },
};
