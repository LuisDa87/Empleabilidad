import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { applicationService } from '../services/application.service.js';

export const ApplicationController = {
  apply: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.sub;
      if (!userId) return res.status(401).json({ message: 'No autenticado' });
      const { vacancyId } = req.body;
      if (!vacancyId) return res.status(400).json({ message: 'Falta vacancyId' });
      // no dejo pasar sin vacancyId porque las reglas viven en el servicio
      const application = await applicationService.apply(userId, vacancyId);
      res.status(201).json(application);
    } catch (e: any) {
      res.status(400).json({ message: e.message || 'Error al postularse' });
    }
  },

  list: async (_req: AuthRequest, res: Response) => {
    const applications = await applicationService.listAll();
    res.json(applications);
  },
};
