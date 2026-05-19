import { injectable, inject } from 'tsyringe';
import { EitherResult, Right } from '../../shared/results/EitherResult';
import { PacienteRepository } from '../../domain/repositories/PacienteRepository';
import { Paciente } from '../../domain/entities/Paciente';
import { PaginationParams, PaginationResult } from '../../shared/types/Pagination';

@injectable()
export class ListPacientesPaginatedUseCase {
  constructor(
    @inject('PacienteRepository')
    private readonly pacienteRepository: PacienteRepository
  ) {}

  public async execute(params: PaginationParams): Promise<EitherResult<null, PaginationResult<Paciente>>> {
    const result = await this.pacienteRepository.findAllPaginated(params);
    return Right.create<null, PaginationResult<Paciente>>(result);
  }
}
