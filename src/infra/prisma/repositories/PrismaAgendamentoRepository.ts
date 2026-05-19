import { injectable } from 'tsyringe';
import { prisma } from '../prismaClient';
import { Agendamento } from '../../../domain/entities/Agendamento';
import { AgendamentoRepository } from '../../../domain/repositories/AgendamentoRepository';
import { PaginationParams, PaginationResult } from '../../../shared/types/Pagination';

@injectable()
export class PrismaAgendamentoRepository implements AgendamentoRepository {
  public async create(agendamentoEntity: Agendamento): Promise<Agendamento> {
    const ag = await prisma.agendamento.create({
      data: {
        pacienteId: agendamentoEntity.pacienteId,
        data: agendamentoEntity.data,
        motivo: agendamentoEntity.motivo,
      },
    });

    return Agendamento.fromPrisma({
      id: ag.id,
      pacienteId: ag.pacienteId,
      data: ag.data,
      motivo: ag.motivo,
      createdAt: ag.createdAt,
      updatedAt: ag.updatedAt,
    });
  }

  public async findAll(): Promise<Agendamento[]> {
    const ags = await prisma.agendamento.findMany({ orderBy: { createdAt: 'desc' } });
    return ags.map((ag: any) =>
      Agendamento.fromPrisma({
        id: ag.id,
        pacienteId: ag.pacienteId,
        data: ag.data,
        motivo: ag.motivo,
        createdAt: ag.createdAt,
        updatedAt: ag.updatedAt,
      })
    );
  }

  public async findAllPaginated(params: PaginationParams): Promise<PaginationResult<Agendamento>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [ags, total] = await Promise.all([
      prisma.agendamento.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.agendamento.count(),
    ]);

    const data = ags.map((ag: any) =>
      Agendamento.fromPrisma({
        id: ag.id,
        pacienteId: ag.pacienteId,
        data: ag.data,
        motivo: ag.motivo,
        createdAt: ag.createdAt,
        updatedAt: ag.updatedAt,
      })
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public async findConflict(data: Date, excludeId?: string): Promise<Agendamento | null> {
    const ag = await prisma.agendamento.findFirst({
      where: { data, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    });
    if (!ag) return null;
    return Agendamento.fromPrisma({
      id: ag.id,
      pacienteId: ag.pacienteId,
      data: ag.data,
      motivo: ag.motivo,
      createdAt: ag.createdAt,
      updatedAt: ag.updatedAt,
    });
  }

  public async findById(id: string): Promise<Agendamento | null> {
    const ag = await prisma.agendamento.findUnique({ where: { id } });
    if (!ag) return null;
    return Agendamento.fromPrisma({
      id: ag.id,
      pacienteId: ag.pacienteId,
      data: ag.data,
      motivo: ag.motivo,
      createdAt: ag.createdAt,
      updatedAt: ag.updatedAt,
    });
  }
  public async update(agendamentoEntity: Agendamento): Promise<Agendamento | null> {
    const ag = await prisma.agendamento.update({
      where: { id: agendamentoEntity.id },
      data: {
        pacienteId: agendamentoEntity.pacienteId,
        data: agendamentoEntity.data,
        motivo: agendamentoEntity.motivo,
      },
    });

    return Agendamento.fromPrisma({
      id: ag.id,
      pacienteId: ag.pacienteId,
      data: ag.data,
      motivo: ag.motivo,
      createdAt: ag.createdAt,
      updatedAt: ag.updatedAt,
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.agendamento.delete({ where: { id } });
  }
}
