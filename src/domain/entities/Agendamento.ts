import { AppError } from '../../shared/errors/AppError';
import { randomUUID } from 'crypto';

export interface AgendamentoProps {
  id: string;
  pacienteId: string;
  data: Date;
  motivo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Agendamento {
  public readonly id: string;
  public readonly pacienteId: string;
  public readonly data: Date;
  public readonly motivo?: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: AgendamentoProps) {
    this.id = props.id;
    this.pacienteId = props.pacienteId;
    this.data = props.data;
    this.motivo = props.motivo ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: AgendamentoProps): Agendamento {
    Agendamento.validate(props);
    return new Agendamento(props);
  }

  public static createNew(props: Omit<AgendamentoProps, 'id' | 'createdAt' | 'updatedAt'>): Agendamento {
    const now = new Date();
    const full: AgendamentoProps = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...props,
    };
    Agendamento.validate(full);
    return new Agendamento(full);
  }

  public static fromPrisma(props: AgendamentoProps): Agendamento {
    return new Agendamento(props);
  }

  public update(fields: Partial<Omit<AgendamentoProps, 'id' | 'createdAt' | 'updatedAt'>>): Agendamento {
    const updated: AgendamentoProps = {
      id: this.id,
      pacienteId: fields.pacienteId ?? this.pacienteId,
      data: fields.data ?? this.data,
      motivo: fields.motivo ?? this.motivo,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    };

    Agendamento.validate(updated);
    return new Agendamento(updated);
  }

  private static validate(props: AgendamentoProps): void {
    if (!props.pacienteId || !props.pacienteId.trim()) {
      throw new AppError('PacienteId é obrigatório', 400);
    }

    if (!(props.data instanceof Date) || Number.isNaN(props.data.getTime())) {
      throw new AppError('Data do agendamento inválida', 400);
    }
  }
}
