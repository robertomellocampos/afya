import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infra/auth/JwtService';

declare global {
  namespace Express {
    interface Request {
      usuarioEmail: string;
    }
  }
}

const jwtService = new JwtService();

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwtService.verify(token);
    req.usuarioEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}
