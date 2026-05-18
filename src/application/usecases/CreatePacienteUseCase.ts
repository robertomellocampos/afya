import { injectable, inject } from "tsyringe";
import { EitherResult, Left, Right } from "../../shared/results/EitherResult";
import { AppError } from "../../shared/errors/AppError";
import { PacienteRepository, CreatePacienteData } from "../../domain/repositories/PacienteRepository";
import { Paciente } from "../../domain/entities/Paciente";

@injectable()
export class CreatePacienteUseCase {
  constructor(
    @inject("PacienteRepository")
    private readonly pacienteRepository: PacienteRepository,
  ) {}

  public async execute(data: CreatePacienteData): Promise<EitherResult<AppError, Paciente>> {
    try {
      const paciente = await this.pacienteRepository.create(data);
      return Right.create<AppError, Paciente>(paciente);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Left.create<AppError, Paciente>(error);
      }
      return Left.create<AppError, Paciente>(new AppError("Erro ao criar paciente", 500));
    }
  }
}
