import { Request, Response } from 'express';
import { vacancyService } from '../services/vacancy.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export const VacancyController = {
  list: async (req: AuthRequest, res: Response) => {
    const role = req.user?.role || 'coder';
    // coder solo ve activas, gestor/admin ven todas
    const vacancies = await vacancyService.list(role);
    res.json(vacancies);
  },

  create: async (req: Request, res: Response) => {
    try {
      const { title, description, technologies, seniority, softSkills, location, modality, salaryRange, company, maxApplicants } =
        req.body;
      if (
        !title ||
        !description ||
        !technologies ||
        !seniority ||
        !softSkills ||
        !location ||
        !modality ||
        !salaryRange ||
        !company ||
        maxApplicants === undefined
      ) {
        return res.status(400).json({ message: 'Datos incompletos' });
      }
      // ojo con maxApplicants, siempre número para evitar guardar texto
      const vacancy = await vacancyService.create({
        title,
        description,
        technologies,
        seniority,
        softSkills,
        location,
        modality,
        salaryRange,
        company,
        maxApplicants: Number(maxApplicants),
      });
      res.status(201).json(vacancy);
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Error al crear vacante' });
    }
  },

  updateMaxApplicants: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { maxApplicants } = req.body;
      if (maxApplicants === undefined) return res.status(400).json({ message: 'Falta maxApplicants' });
      const vacancy = await vacancyService.updateMaxApplicants(id, Number(maxApplicants));
      res.json(vacancy);
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Error al actualizar cupo' });
    }
  },

  setStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      if (isActive === undefined) return res.status(400).json({ message: 'Falta isActive' });
      const vacancy = await vacancyService.setStatus(id, Boolean(isActive));
      res.json(vacancy);
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Error al actualizar estado' });
    }
  },
};
