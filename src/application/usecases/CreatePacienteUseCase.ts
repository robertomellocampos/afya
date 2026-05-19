import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { PacienteRepository, CreatePacienteData } from '../../domain/repositories/PacienteRepository';
import { AuditLogRepository } from '../../domain/repositories/AuditLogRepository';
import { Paciente } from '../../domain/entities/Paciente';
import { AuditLog } from '../../domain/entities/AuditLog';
import { Log } from '../../shared/log/Log';

@injectable()
export class CreatePacienteUseCase {
  constructor(
    @inject('PacienteRepository')
    private readonly pacienteRepository: PacienteRepository,
    @inject('AuditLogRepository')
    private readonly auditLogRepository: AuditLogRepository,
    @inject('Log')
    private readonly logger: Log
  ) {}

  public async execute(data: CreatePacienteData, usuarioEmail: string): Promise<EitherResult<AppError, Paciente>> {
    try {
      this.logger.setContext(CreatePacienteUseCase.name);

      const pacienteEntity = Paciente.createNew({
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        dataNascimento: data.dataNascimento,
        sexo: data.sexo as any,
        peso: data.peso,
      });

      this.logger.log('Creating paciente', { email: data.email });
      const paciente = await this.pacienteRepository.create(pacienteEntity);
      this.logger.log('Paciente created', { id: paciente.id });

      await this.auditLogRepository.create(
        AuditLog.createNew({
          usuarioEmail,
          acao: 'PACIENTE_CREATE',
          entidadeId: paciente.id,
          dadosAlterados: JSON.stringify({ nome: paciente.nome, email: paciente.email, telefone: paciente.telefone }),
        })
      );

      return Right.create<AppError, Paciente>(paciente);
    } catch (error: unknown) {
      this.logger.error('Error creating paciente', { error });
      if (error instanceof AppError) {
        return Left.create<AppError, Paciente>(error);
      }
      return Left.create<AppError, Paciente>(new AppError('Erro ao criar paciente', 500));
    }
  }
}
