import { injectable } from 'tsyringe';
import { prisma } from '../prismaClient';
import { Usuario } from '../../../domain/entities/Usuario';
import { UsuarioRepository } from '../../../domain/repositories/UsuarioRepository';

@injectable()
export class PrismaUsuarioRepository implements UsuarioRepository {
  public async create(entity: Usuario): Promise<Usuario> {
    const row = await prisma.usuario.create({
      data: { id: entity.id, nome: entity.nome, email: entity.email, senha: entity.senha },
    });
    return Usuario.fromPrisma(row);
  }

  public async findByEmail(email: string): Promise<Usuario | null> {
    const row = await prisma.usuario.findUnique({ where: { email } });
    if (!row) return null;
    return Usuario.fromPrisma(row);
  }
}
