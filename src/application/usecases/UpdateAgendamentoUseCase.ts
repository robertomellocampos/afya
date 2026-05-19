import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { AgendamentoRepository, UpdateAgendamentoData } from '../../domain/repositories/AgendamentoRepository';
import { AuditLogRepository } from '../../domain/repositories/AuditLogRepository';
import { Agendamento } from '../../domain/entities/Agendamento';
import { AuditLog } from '../../domain/entities/AuditLog';

@injectable()
export class UpdateAgendamentoUseCase {
  constructor(
    @inject('AgendamentoRepository')
    private readonly agendamentoRepository: AgendamentoRepository,
    @inject('AuditLogRepository')
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  public async execute(id: string, data: UpdateAgendamentoData, usuarioEmail: string): Promise<EitherResult<AppError, Agendamento>> {
    try {
      const existing = await this.agendamentoRepository.findById(id);
      if (!existing) {
        return Left.create(new AppError('Agendamento não encontrado', 404));
      }

      if (data.data) {
        const conflict = await this.agendamentoRepository.findConflict(data.data, id);
        if (conflict) {
          return Left.create(new AppError('Já existe um agendamento neste horário', 409));
        }
      }

      const updatedEntity = existing.update({ data: data.data, motivo: data.motivo });
      const ag = await this.agendamentoRepository.update(updatedEntity);

      if (!ag) {
        return Left.create(new AppError('Erro ao atualizar agendamento', 500));
      }

      await this.auditLogRepository.create(
        AuditLog.createNew({
          usuarioEmail,
          acao: 'AGENDAMENTO_UPDATE',
          entidadeId: id,
          dadosAlterados: JSON.stringify({ before: { data: existing.data, motivo: existing.motivo }, after: { data: ag.data, motivo: ag.motivo } }),
        })
      );

      return Right.create<AppError, Agendamento>(ag);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Left.create<AppError, Agendamento>(error);
      }
      return Left.create<AppError, Agendamento>(new AppError('Erro ao atualizar agendamento', 500));
    }
  }
}
