import { injectable } from 'tsyringe';
import { prisma } from '../prismaClient';
import { AuditLog } from '../../../domain/entities/AuditLog';
import { AuditLogRepository } from '../../../domain/repositories/AuditLogRepository';

@injectable()
export class PrismaAuditLogRepository implements AuditLogRepository {
  public async create(log: AuditLog): Promise<void> {
    await prisma.auditLog.create({
      data: {
        id: log.id,
        usuarioEmail: log.usuarioEmail,
        acao: log.acao,
        entidadeId: log.entidadeId,
        dadosAlterados: log.dadosAlterados,
        createdAt: log.createdAt,
      },
    });
  }
}
