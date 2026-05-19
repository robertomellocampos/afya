import { Request, Response } from 'express';
import { JwtService } from '../../infra/auth/JwtService';

const jwtService = new JwtService();

export function Authorized() {
  return function (_target: object, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const original = descriptor.value as (req: Request, res: Response) => Promise<Response>;

    descriptor.value = async function (req: Request, res: Response): Promise<Response> {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token não fornecido' });
      }

      const token = authHeader.split(' ')[1];
      try {
        const payload = jwtService.verify(token);
        req.usuarioEmail = payload.email;
        return await original.call(this, req, res);
      } catch {
        return res.status(401).json({ message: 'Token inválido ou expirado' });
      }
    };

    return descriptor;
  };
}
