import { randomUUID } from 'crypto';

export interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  senha: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Usuario {
  public readonly id: string;
  public readonly nome: string;
  public readonly email: string;
  public readonly senha: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: UsuarioProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.email = props.email;
    this.senha = props.senha;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static createNew(props: Omit<UsuarioProps, 'id' | 'createdAt' | 'updatedAt'>): Usuario {
    const now = new Date();
    return new Usuario({ id: randomUUID(), createdAt: now, updatedAt: now, ...props });
  }

  public static fromPrisma(props: UsuarioProps): Usuario {
    return new Usuario(props);
  }
}
