import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { AgendamentoRepository, UpdateAgendamentoData } from '../../domain/repositories/AgendamentoRepository';
import { Agendamento } from '../../domain/entities/Agendamento';

@injectable()
export class UpdateAgendamentoUseCase {
  constructor(
    @inject('AgendamentoRepository')
    private readonly agendamentoRepository: AgendamentoRepository
  ) {}

  public async execute(id: string, data: UpdateAgendamentoData): Promise<EitherResult<AppError, Agendamento>> {
    try {
      const existing = await this.agendamentoRepository.findById(id);
      if (!existing) {
        return Left.create<AppError, Agendamento>(new AppError('Agendamento não encontrado', 404));
      }

      const updatedEntity = existing.update({
        data: data.data,
        motivo: data.motivo,
      });
      const ag = await this.agendamentoRepository.update(updatedEntity);

      if (!ag) {
        return Left.create<AppError, Agendamento>(new AppError('Erro ao atualizar agendamento', 500));
      }

      return Right.create<AppError, Agendamento>(ag);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Left.create<AppError, Agendamento>(error);
      }
      return Left.create<AppError, Agendamento>(new AppError('Erro ao atualizar agendamento', 500));
    }
  }
}
