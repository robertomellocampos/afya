import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { PacienteNoteRepository } from '../../domain/repositories/PacienteNoteRepository';
import { AgendamentoRepository } from '../../domain/repositories/AgendamentoRepository';
import { AuditLogRepository } from '../../domain/repositories/AuditLogRepository';
import { PacienteNote } from '../../domain/entities/PacienteNote';
import { AuditLog } from '../../domain/entities/AuditLog';
import { Log } from '../../shared/log/Log';

interface CreatePacienteNoteInput {
  agendamentoId: string;
  nota: string;
}

@injectable()
export class CreatePacienteNoteUseCase {
  constructor(
    @inject('PacienteNoteRepository')
    private readonly pacienteNoteRepository: PacienteNoteRepository,
    @inject('AgendamentoRepository')
    private readonly agendamentoRepository: AgendamentoRepository,
    @inject('AuditLogRepository')
    private readonly auditLogRepository: AuditLogRepository,
    @inject('Log')
    private readonly logger: Log
  ) {}

  public async execute(data: CreatePacienteNoteInput, usuarioEmail: string): Promise<EitherResult<AppError, PacienteNote>> {
    try {
      this.logger.setContext(CreatePacienteNoteUseCase.name);

      const agendamento = await this.agendamentoRepository.findById(data.agendamentoId);
      if (!agendamento) {
        return Left.create<AppError, PacienteNote>(new AppError('Agendamento não encontrado', 404));
      }

      const entity = PacienteNote.createNew({
        pacienteId: agendamento.pacienteId,
        agendamentoId: data.agendamentoId,
        nota: data.nota,
      });

      this.logger.log('Creating paciente note', { agendamentoId: data.agendamentoId });
      const note = await this.pacienteNoteRepository.create(entity);
      this.logger.log('PacienteNote created', { id: note.id });

      await this.auditLogRepository.create(
        AuditLog.createNew({
          usuarioEmail,
          acao: 'PACIENTE_NOTE_CREATE',
          entidadeId: note.id,
          dadosAlterados: JSON.stringify({ pacienteId: note.pacienteId, agendamentoId: note.agendamentoId }),
        })
      );

      return Right.create<AppError, PacienteNote>(note);
    } catch (error: unknown) {
      this.logger.error('Error creating paciente note', { error });
      if (error instanceof AppError) {
        return Left.create<AppError, PacienteNote>(error);
      }
      return Left.create<AppError, PacienteNote>(new AppError('Erro ao criar anotação', 500));
    }
  }
}
