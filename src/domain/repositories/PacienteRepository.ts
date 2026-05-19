import { Paciente } from '../entities/Paciente';
import { PaginationParams, PaginationResult } from '../../shared/types/Pagination';

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
  create(paciente: Paciente): Promise<Paciente>;
  findAll(): Promise<Paciente[]>;
  findAllPaginated(params: PaginationParams): Promise<PaginationResult<Paciente>>;
  update(paciente: Paciente): Promise<Paciente | null>;
  findById(id: string): Promise<Paciente | null>;
}
