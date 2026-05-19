import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { PacienteRepository, UpdatePacienteData } from '../../domain/repositories/PacienteRepository';
import { Paciente } from '../../domain/entities/Paciente';

@injectable()
export class UpdatePacienteUseCase {
  constructor(
    @inject('PacienteRepository')
    private readonly pacienteRepository: PacienteRepository
  ) {}

  public async execute(id: string, data: UpdatePacienteData): Promise<EitherResult<AppError, Paciente>> {
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

      return Right.create<AppError, Paciente>(paciente);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Left.create<AppError, Paciente>(error);
      }
      return Left.create<AppError, Paciente>(new AppError('Erro ao atualizar paciente', 500));
    }
  }
}
