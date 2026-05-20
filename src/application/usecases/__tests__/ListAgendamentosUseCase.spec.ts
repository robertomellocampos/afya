import 'reflect-metadata';
import { ListAgendamentosUseCase } from '../ListAgendamentosUseCase';
import { makeAgendamentoRepositoryMock } from '../../../shared/test/mocks';
import { makeAgendamento } from '../../../shared/test/factories';

describe('ListAgendamentosUseCase', () => {
  const agendamentoRepo = makeAgendamentoRepositoryMock();
  const useCase = new ListAgendamentosUseCase(agendamentoRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve retornar lista de agendamentos', async () => {
    const agendamentos = [makeAgendamento(), makeAgendamento({ id: 'agendamento-id-2' })];
    agendamentoRepo.findAll.mockResolvedValue(agendamentos);

    const result = await useCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual(agendamentos);
    expect(agendamentoRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar lista vazia quando não houver agendamentos', async () => {
    agendamentoRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual([]);
  });
});
