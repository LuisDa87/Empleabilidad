import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';
import { UserRole } from '../models/User.js';

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'No autorizado' });
    next();
  };
}
