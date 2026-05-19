import { AppError } from '../../shared/errors/AppError';
import { randomUUID } from 'crypto';

export interface PacienteNoteProps {
  id: string;
  pacienteId: string;
  agendamentoId: string;
  nota: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PacienteNote {
  public readonly id: string;
  public readonly pacienteId: string;
  public readonly agendamentoId: string;
  public readonly nota: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: PacienteNoteProps) {
    this.id = props.id;
    this.pacienteId = props.pacienteId;
    this.agendamentoId = props.agendamentoId;
    this.nota = props.nota;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: PacienteNoteProps): PacienteNote {
    PacienteNote.validate(props);
    return new PacienteNote(props);
  }

  public static createNew(props: Omit<PacienteNoteProps, 'id' | 'createdAt' | 'updatedAt'>): PacienteNote {
    const now = new Date();
    const full: PacienteNoteProps = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...props,
    };
    PacienteNote.validate(full);
    return new PacienteNote(full);
  }

  public static fromPrisma(props: PacienteNoteProps): PacienteNote {
    return new PacienteNote(props);
  }

  private static validate(props: PacienteNoteProps): void {
    if (!props.pacienteId?.trim()) {
      throw new AppError('PacienteId é obrigatório', 400);
    }
    if (!props.agendamentoId?.trim()) {
      throw new AppError('AgendamentoId é obrigatório', 400);
    }
    if (!props.nota?.trim()) {
      throw new AppError('Nota é obrigatória', 400);
    }
  }
}
