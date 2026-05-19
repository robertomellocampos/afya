import { injectable, inject } from 'tsyringe';
import { EitherResult, Left, Right } from '../../shared/results/EitherResult';
import { AppError } from '../../shared/errors/AppError';
import { PacienteNoteRepository } from '../../domain/repositories/PacienteNoteRepository';
import { PacienteRepository } from '../../domain/repositories/PacienteRepository';
import { PacienteNote } from '../../domain/entities/PacienteNote';

@injectable()
export class ListPacienteNotesByPacienteUseCase {
  constructor(
    @inject('PacienteNoteRepository')
    private readonly pacienteNoteRepository: PacienteNoteRepository,
    @inject('PacienteRepository')
    private readonly pacienteRepository: PacienteRepository
  ) {}

  public async execute(pacienteId: string): Promise<EitherResult<AppError, PacienteNote[]>> {
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente) {
      return Left.create<AppError, PacienteNote[]>(new AppError('Paciente não encontrado', 404));
    }

    const notes = await this.pacienteNoteRepository.findByPacienteId(pacienteId);
    return Right.create<AppError, PacienteNote[]>(notes);
  }
}
