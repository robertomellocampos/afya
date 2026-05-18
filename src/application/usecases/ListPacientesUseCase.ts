import { injectable, inject } from "tsyringe";
import { EitherResult, Right } from "../../shared/results/EitherResult";
import { PacienteRepository } from "../../domain/repositories/PacienteRepository";
import { Paciente } from "../../domain/entities/Paciente";

@injectable()
export class ListPacientesUseCase {
  constructor(
    @inject("PacienteRepository")
    private readonly pacienteRepository: PacienteRepository,
  ) {}

  public async execute(): Promise<EitherResult<null, Paciente[]>> {
    const pacientes = await this.pacienteRepository.findAll();
    return Right.create<null, Paciente[]>(pacientes);
  }
}
