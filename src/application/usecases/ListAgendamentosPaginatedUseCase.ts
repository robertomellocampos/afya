import { injectable, inject } from 'tsyringe';
import { EitherResult, Right } from '../../shared/results/EitherResult';
import { AgendamentoRepository } from '../../domain/repositories/AgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';
import { PaginationParams, PaginationResult } from '../../shared/types/Pagination';

@injectable()
export class ListAgendamentosPaginatedUseCase {
  constructor(
    @inject('AgendamentoRepository')
    private readonly agendamentoRepository: AgendamentoRepository
  ) {}

  public async execute(params: PaginationParams): Promise<EitherResult<null, PaginationResult<Agendamento>>> {
    const result = await this.agendamentoRepository.findAllPaginated(params);
    return Right.create<null, PaginationResult<Agendamento>>(result);
  }
}
