import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { PacienteRepository, UpdatePacienteData } from '../../domain/repositories/PacienteRepository';
import { AuditLogRepository } from '../../domain/repositories/AuditLogRepository';
import { Paciente } from '../../domain/entities/Paciente';
import { AuditLog } from '../../domain/entities/AuditLog';

@injectable()
export class UpdatePacienteUseCase {
  constructor(
    @inject('PacienteRepository')
    private readonly pacienteRepository: PacienteRepository,
    @inject('AuditLogRepository')
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  public async execute(id: string, data: UpdatePacienteData, usuarioEmail: string): Promise<EitherResult<AppError, Paciente>> {
    try {
      const existing = await this.pacienteRepository.findById(id);
      if (!existing) {
        return Left.create<AppError, Paciente>(new AppError('Paciente não encontrado', 404));
      }

      const updatedEntity = existing.update({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        dataNascimento: data.dataNascimento,
        sexo: data.sexo as any,
        peso: data.peso,
      });
      const paciente = await this.pacienteRepository.update(updatedEntity);

      if (!paciente) {
        return Left.create<AppError, Paciente>(new AppError('Erro ao atualizar paciente', 500));
      }

      await this.auditLogRepository.create(
        AuditLog.createNew({
          usuarioEmail,
          acao: 'PACIENTE_UPDATE',
          entidadeId: id,
          dadosAlterados: JSON.stringify({ before: data, after: { nome: paciente.nome, email: paciente.email, telefone: paciente.telefone } }),
        })
      );

      return Right.create<AppError, Paciente>(paciente);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Left.create<AppError, Paciente>(error);
      }
      return Left.create<AppError, Paciente>(new AppError('Erro ao atualizar paciente', 500));
    }
  }
}
