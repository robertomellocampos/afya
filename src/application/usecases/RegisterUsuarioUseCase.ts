import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository';
import { Usuario } from '../../domain/entities/Usuario';

export interface RegisterUsuarioData {
  nome: string;
  email: string;
  senha: string;
}

@injectable()
export class RegisterUsuarioUseCase {
  constructor(
    @inject('UsuarioRepository')
    private readonly usuarioRepository: UsuarioRepository
  ) {}

  public async execute(data: RegisterUsuarioData): Promise<EitherResult<AppError, Omit<Usuario, 'senha'>>> {
    const existing = await this.usuarioRepository.findByEmail(data.email);
    if (existing) {
      return Left.create(new AppError('Email já cadastrado', 409));
    }

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const usuario = Usuario.createNew({ nome: data.nome, email: data.email, senha: senhaHash });
    const created = await this.usuarioRepository.create(usuario);

    const { senha: _, ...withoutSenha } = created;
    return Right.create(withoutSenha as Omit<Usuario, 'senha'>);
  }
}
