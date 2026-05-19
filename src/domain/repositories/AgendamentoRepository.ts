import { Agendamento } from '../entities/Agendamento';
import { PaginationParams, PaginationResult } from '../../shared/types/Pagination';

export interface CreateAgendamentoData {
  pacienteId: string;
  data: Date;
  motivo?: string;
}

export interface UpdateAgendamentoData {
  data?: Date;
  motivo?: string;
}

export interface AgendamentoRepository {
  create(agendamento: Agendamento): Promise<Agendamento>;
  findAll(): Promise<Agendamento[]>;
  findAllPaginated(params: PaginationParams): Promise<PaginationResult<Agendamento>>;
  findById(id: string): Promise<Agendamento | null>;
  findConflict(data: Date, excludeId?: string): Promise<Agendamento | null>;
  update(agendamento: Agendamento): Promise<Agendamento | null>;
  delete(id: string): Promise<void>;
}
