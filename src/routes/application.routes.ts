import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', verifyJWT, requireRole('coder'), ApplicationController.apply);
router.get('/', verifyJWT, requireRole('admin', 'gestor'), ApplicationController.list);

export default router;
