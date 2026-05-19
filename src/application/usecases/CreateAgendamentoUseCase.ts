import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { AgendamentoRepository, CreateAgendamentoData } from '../../domain/repositories/AgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';
import { Log } from '../../shared/log/Log';

@injectable()
export class CreateAgendamentoUseCase {
  constructor(
    @inject('AgendamentoRepository')
    private readonly agendamentoRepository: AgendamentoRepository,
    @inject('Log')
    private readonly logger: Log
  ) {}

  public async execute(data: CreateAgendamentoData): Promise<EitherResult<AppError, Agendamento>> {
    try {
      this.logger.setContext(CreateAgendamentoUseCase.name);

      const agEntity = Agendamento.createNew({
        pacienteId: data.pacienteId,
        data: data.data,
        motivo: data.motivo,
      });

      this.logger.log('Creating agendamento', { pacienteId: data.pacienteId });

      const agendamento = await this.agendamentoRepository.create(agEntity);

      this.logger.log('Agendamento created', { id: agendamento.id });

      return Right.create<AppError, Agendamento>(agendamento);
    } catch (error: unknown) {
      this.logger.error('Error creating agendamento', { error });
      if (error instanceof AppError) {
        return Left.create<AppError, Agendamento>(error);
      }
      return Left.create<AppError, Agendamento>(new AppError('Erro ao criar agendamento', 500));
    }
  }
}
