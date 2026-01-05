import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function verifyApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== env.apiKey) return res.status(401).json({ message: 'API Key inválida o ausente' });
  next();
}
