import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { AgendamentoRepository } from '../../domain/repositories/AgendamentoRepository';

@injectable()
export class DeleteAgendamentoUseCase {
  constructor(
    @inject('AgendamentoRepository')
    private readonly agendamentoRepository: AgendamentoRepository
  ) {}

  public async execute(id: string): Promise<EitherResult<AppError, null>> {
    try {
      const ag = await this.agendamentoRepository.findById(id);
      if (!ag) return Left.create<AppError, null>(new AppError('Agendamento não encontrado', 404));

      await this.agendamentoRepository.delete(id);
      return Right.create<AppError, null>(null);
    } catch (error: unknown) {
      if (error instanceof AppError) return Left.create<AppError, null>(error);
      return Left.create<AppError, null>(new AppError('Erro ao deletar agendamento', 500));
    }
  }
}
