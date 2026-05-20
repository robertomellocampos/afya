import 'reflect-metadata';
import { DeleteAgendamentoUseCase } from '../DeleteAgendamentoUseCase';
import { makeAgendamentoRepositoryMock } from '../../../shared/test/mocks';
import { makeAgendamento } from '../../../shared/test/factories';

describe('DeleteAgendamentoUseCase', () => {
  const agendamentoRepo = makeAgendamentoRepositoryMock();
  const useCase = new DeleteAgendamentoUseCase(agendamentoRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve deletar agendamento com sucesso', async () => {
    agendamentoRepo.findById.mockResolvedValue(makeAgendamento());
    agendamentoRepo.delete.mockResolvedValue(undefined);

    const result = await useCase.execute('agendamento-id-1');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toBeNull();
    expect(agendamentoRepo.delete).toHaveBeenCalledWith('agendamento-id-1');
  });

  it('deve retornar Left 404 quando agendamento não for encontrado', async () => {
    agendamentoRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('id-inexistente');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(404);
    expect(agendamentoRepo.delete).not.toHaveBeenCalled();
  });

  it('deve retornar Left 500 quando o repositório lançar um erro inesperado', async () => {
    agendamentoRepo.findById.mockResolvedValue(makeAgendamento());
    agendamentoRepo.delete.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute('agendamento-id-1');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(500);
  });
});
