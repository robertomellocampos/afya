import { Paciente } from "../entities/Paciente";

export interface CreatePacienteData {
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: Date;
  sexo: string;
  peso: number;
}

export interface UpdatePacienteData {
  nome?: string;
  telefone?: string;
  email?: string;
  dataNascimento?: Date;
  sexo?: string;
  peso?: number;
}

export interface PacienteRepository {
  create(data: CreatePacienteData): Promise<Paciente>;
  findAll(): Promise<Paciente[]>;
  update(id: string, data: UpdatePacienteData): Promise<Paciente | null>;
  findById(id: string): Promise<Paciente | null>;
}
