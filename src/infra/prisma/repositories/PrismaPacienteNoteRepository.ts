import { injectable } from 'tsyringe';
import { prisma } from '../prismaClient';
import { PacienteNote } from '../../../domain/entities/PacienteNote';
import { PacienteNoteRepository } from '../../../domain/repositories/PacienteNoteRepository';

@injectable()
export class PrismaPacienteNoteRepository implements PacienteNoteRepository {
  public async create(note: PacienteNote): Promise<PacienteNote> {
    const created = await prisma.pacienteNote.create({
      data: {
        id: note.id,
        pacienteId: note.pacienteId,
        agendamentoId: note.agendamentoId,
        nota: note.nota,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });

    return PacienteNote.fromPrisma({
      id: created.id,
      pacienteId: created.pacienteId,
      agendamentoId: created.agendamentoId,
      nota: created.nota,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  }

  public async findByPacienteId(pacienteId: string): Promise<PacienteNote[]> {
    const notes = await prisma.pacienteNote.findMany({
      where: { pacienteId },
      orderBy: { createdAt: 'desc' },
    });

    return notes.map((n: any) =>
      PacienteNote.fromPrisma({
        id: n.id,
        pacienteId: n.pacienteId,
        agendamentoId: n.agendamentoId,
        nota: n.nota,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })
    );
  }
}
