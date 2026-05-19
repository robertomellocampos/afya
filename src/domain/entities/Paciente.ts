import { AppError } from '../../shared/errors/AppError';
import { randomUUID } from 'crypto';

export type Sexo = 'M' | 'F' | 'O';

export interface PacienteProps {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: Date;
  sexo: Sexo;
  peso: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Paciente {
  public readonly id: string;
  public readonly nome: string;
  public readonly telefone: string;
  public readonly email: string;
  public readonly dataNascimento: Date;
  public readonly sexo: Sexo;
  public readonly peso: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: PacienteProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.telefone = props.telefone;
    this.email = props.email;
    this.dataNascimento = props.dataNascimento;
    this.sexo = props.sexo;
    this.peso = props.peso;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: PacienteProps): Paciente {
    Paciente.validate(props);
    return new Paciente(props);
  }

  // Cria uma nova entidade gerando id e timestamps
  public static createNew(props: Omit<PacienteProps, 'id' | 'createdAt' | 'updatedAt'>): Paciente {
    const now = new Date();
    const full: PacienteProps = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...props,
    };
    Paciente.validate(full);
    return new Paciente(full);
  }

  // Cria a entidade a partir de dados persistidos sem rodar validações.
  // Usado pelo repositório para materializar objetos do banco.
  public static fromPrisma(props: PacienteProps): Paciente {
    return new Paciente(props);
  }

  public update(fields: Partial<Omit<PacienteProps, 'id' | 'createdAt' | 'updatedAt'>>): Paciente {
    const updated: PacienteProps = {
      id: this.id,
      nome: fields.nome ?? this.nome,
      telefone: fields.telefone ?? this.telefone,
      email: fields.email ?? this.email,
      dataNascimento: fields.dataNascimento ?? this.dataNascimento,
      sexo: (fields.sexo as Sexo) ?? this.sexo,
      peso: fields.peso ?? this.peso,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    };

    Paciente.validate(updated);
    return new Paciente(updated);
  }

  private static validate(props: PacienteProps): void {
    if (!props.nome.trim()) {
      throw new AppError('Nome é obrigatório', 400);
    }

    if (!props.telefone.trim()) {
      throw new AppError('Telefone é obrigatório', 400);
    }

    if (!props.email.trim() || !props.email.includes('@')) {
      throw new AppError('Email inválido', 400);
    }

    if (!(props.dataNascimento instanceof Date) || Number.isNaN(props.dataNascimento.getTime())) {
      throw new AppError('Data de nascimento inválida', 400);
    }

    if (!['M', 'F', 'O'].includes(props.sexo)) {
      throw new AppError('Sexo deve ser M, F ou O', 400);
    }

    if (props.peso <= 0) {
      throw new AppError('Peso deve ser maior que zero', 400);
    }
  }
}
