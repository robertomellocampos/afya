import 'reflect-metadata';
import { ListPacientesPaginatedUseCase } from '../ListPacientesPaginatedUseCase';
import { makePacienteRepositoryMock } from '../../../shared/test/mocks';
import { makePaciente } from '../../../shared/test/factories';

describe('ListPacientesPaginatedUseCase', () => {
  const pacienteRepo = makePacienteRepositoryMock();
  const useCase = new ListPacientesPaginatedUseCase(pacienteRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve retornar pacientes paginados', async () => {
    const pacientes = [makePaciente()];
    const paginationResult = {
      data: pacientes,
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
    pacienteRepo.findAllPaginated.mockResolvedValue(paginationResult);

    const result = await useCase.execute({ page: 1, pageSize: 10 });

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual(paginationResult);
    expect(pacienteRepo.findAllPaginated).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });

  it('deve usar parâmetros de paginação padrão quando não informados', async () => {
    const paginationResult = { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    pacienteRepo.findAllPaginated.mockResolvedValue(paginationResult);

    const result = await useCase.execute({});

    expect(result.isRight()).toBe(true);
    expect(pacienteRepo.findAllPaginated).toHaveBeenCalledWith({});
  });
});
