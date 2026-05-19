import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository';
import { JwtService } from '../../infra/auth/JwtService';

export interface LoginUsuarioData {
  email: string;
  senha: string;
}

@injectable()
export class LoginUsuarioUseCase {
  constructor(
    @inject('UsuarioRepository')
    private readonly usuarioRepository: UsuarioRepository,
    @inject('JwtService')
    private readonly jwtService: JwtService
  ) {}

  public async execute(data: LoginUsuarioData): Promise<EitherResult<AppError, { token: string }>> {
    const usuario = await this.usuarioRepository.findByEmail(data.email);
    if (!usuario) {
      return Left.create(new AppError('Credenciais inválidas', 401));
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaValida) {
      return Left.create(new AppError('Credenciais inválidas', 401));
    }

    const token = this.jwtService.sign({ email: usuario.email });
    return Right.create({ token });
  }
}
