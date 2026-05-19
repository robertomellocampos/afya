import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { PacienteRepository } from '../../domain/repositories/PacienteRepository';
import { AuditLogRepository } from '../../domain/repositories/AuditLogRepository';
import { AuditLog } from '../../domain/entities/AuditLog';
import { Paciente } from '../../domain/entities/Paciente';

@injectable()
export class AnonymizePacienteUseCase {
  constructor(
    @inject('PacienteRepository')
    private readonly pacienteRepository: PacienteRepository,
    @inject('AuditLogRepository')
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  public async execute(id: string, usuarioEmail: string): Promise<EitherResult<AppError, Paciente>> {
    const existing = await this.pacienteRepository.findById(id);
    if (!existing) {
      return Left.create(new AppError('Paciente não encontrado', 404));
    }

    const before = {
      nome: existing.nome,
      telefone: existing.telefone,
      email: existing.email,
      dataNascimento: existing.dataNascimento,
      sexo: existing.sexo,
      peso: existing.peso,
    };

    const anonymized = existing.update({
      nome: 'REMOVIDO',
      telefone: '00000000000',
      email: `removido-${id}@lgpd.com`,
      dataNascimento: new Date('1900-01-01'),
      sexo: 'O',
      peso: 1,
    });

    const updated = await this.pacienteRepository.update(anonymized);
    if (!updated) {
      return Left.create(new AppError('Erro ao anonimizar paciente', 500));
    }

    await this.auditLogRepository.create(
      AuditLog.createNew({
        usuarioEmail,
        acao: 'PACIENTE_UPDATE',
        entidadeId: id,
        dadosAlterados: JSON.stringify({ before, after: 'ANONIMIZADO' }),
      })
    );

    return Right.create(updated);
  }
}
