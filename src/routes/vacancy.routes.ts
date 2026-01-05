import { Router } from 'express';
import { VacancyController } from '../controllers/vacancy.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', verifyJWT, VacancyController.list);
router.post('/', verifyJWT, requireRole('admin', 'gestor'), VacancyController.create);
router.patch('/:id/max-applicants', verifyJWT, requireRole('admin', 'gestor'), VacancyController.updateMaxApplicants);
router.patch('/:id/status', verifyJWT, requireRole('admin', 'gestor'), VacancyController.setStatus);

export default router;
