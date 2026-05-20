import 'reflect-metadata';
import { ListAgendamentosPaginatedUseCase } from '../ListAgendamentosPaginatedUseCase';
import { makeAgendamentoRepositoryMock } from '../../../shared/test/mocks';
import { makeAgendamento } from '../../../shared/test/factories';

describe('ListAgendamentosPaginatedUseCase', () => {
  const agendamentoRepo = makeAgendamentoRepositoryMock();
  const useCase = new ListAgendamentosPaginatedUseCase(agendamentoRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve retornar agendamentos paginados', async () => {
    const agendamentos = [makeAgendamento()];
    const paginationResult = {
      data: agendamentos,
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    };
    agendamentoRepo.findAllPaginated.mockResolvedValue(paginationResult);

    const result = await useCase.execute({ page: 1, pageSize: 10 });

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual(paginationResult);
    expect(agendamentoRepo.findAllPaginated).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });

  it('deve usar parâmetros de paginação padrão quando não informados', async () => {
    const paginationResult = { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    agendamentoRepo.findAllPaginated.mockResolvedValue(paginationResult);

    const result = await useCase.execute({});

    expect(result.isRight()).toBe(true);
    expect(agendamentoRepo.findAllPaginated).toHaveBeenCalledWith({});
  });
});
