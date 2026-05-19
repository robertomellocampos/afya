import { injectable, inject } from 'tsyringe';
import { EitherResult, Right } from '../../shared/results/EitherResult';
import { AgendamentoRepository } from '../../domain/repositories/AgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';

@injectable()
export class ListAgendamentosUseCase {
  constructor(
    @inject('AgendamentoRepository')
    private readonly agendamentoRepository: AgendamentoRepository
  ) {}

  public async execute(): Promise<EitherResult<null, Agendamento[]>> {
    const ags = await this.agendamentoRepository.findAll();
    return Right.create<null, Agendamento[]>(ags);
  }
}
