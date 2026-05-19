import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { RegisterUsuarioUseCase } from '../../application/usecases/RegisterUsuarioUseCase';
import { LoginUsuarioUseCase } from '../../application/usecases/LoginUsuarioUseCase';
import { z } from 'zod';

const registerSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  senha: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

@injectable()
export class AuthController {
  constructor(
    private readonly registerUsuarioUseCase: RegisterUsuarioUseCase,
    private readonly loginUsuarioUseCase: LoginUsuarioUseCase
  ) {}

  public async register(req: Request, res: Response): Promise<Response> {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.errors });
    }

    const result = await this.registerUsuarioUseCase.execute(parse.data);
    if (result.isLeft()) {
      const err = result.getValue();
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(201).json(result.getValue());
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ errors: parse.error.errors });
    }

    const result = await this.loginUsuarioUseCase.execute(parse.data);
    if (result.isLeft()) {
      const err = result.getValue();
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(200).json(result.getValue());
  }
}
