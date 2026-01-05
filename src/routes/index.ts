import { Router } from 'express';
import authRoutes from './auth.routes.js';
import vacancyRoutes from './vacancy.routes.js';
import applicationRoutes from './application.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vacancies', vacancyRoutes);
router.use('/applications', applicationRoutes);
// todas las rutas de negocio quedan debajo de /api en app.ts (con api-key)

export default router;
