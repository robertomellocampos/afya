import { randomUUID } from 'crypto';

export type AuditAction =
  | 'PACIENTE_CREATE'
  | 'PACIENTE_UPDATE'
  | 'AGENDAMENTO_CREATE'
  | 'AGENDAMENTO_UPDATE'
  | 'PACIENTE_NOTE_CREATE';

export interface AuditLogProps {
  id: string;
  usuarioEmail: string;
  acao: AuditAction;
  entidadeId: string;
  dadosAlterados: string;
  createdAt: Date;
}

export class AuditLog {
  public readonly id: string;
  public readonly usuarioEmail: string;
  public readonly acao: AuditAction;
  public readonly entidadeId: string;
  public readonly dadosAlterados: string;
  public readonly createdAt: Date;

  private constructor(props: AuditLogProps) {
    this.id = props.id;
    this.usuarioEmail = props.usuarioEmail;
    this.acao = props.acao;
    this.entidadeId = props.entidadeId;
    this.dadosAlterados = props.dadosAlterados;
    this.createdAt = props.createdAt;
  }

  public static createNew(props: Omit<AuditLogProps, 'id' | 'createdAt'>): AuditLog {
    return new AuditLog({ id: randomUUID(), createdAt: new Date(), ...props });
  }

  public static fromPrisma(props: AuditLogProps): AuditLog {
    return new AuditLog(props);
  }
}
