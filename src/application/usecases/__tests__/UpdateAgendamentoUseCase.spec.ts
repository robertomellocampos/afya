import 'reflect-metadata';
import { UpdateAgendamentoUseCase } from '../UpdateAgendamentoUseCase';
import { makeAgendamentoRepositoryMock, makeAuditLogRepositoryMock } from '../../../shared/test/mocks';
import { makeAgendamento } from '../../../shared/test/factories';

describe('UpdateAgendamentoUseCase', () => {
  const agendamentoRepo = makeAgendamentoRepositoryMock();
  const auditRepo = makeAuditLogRepositoryMock();
  const useCase = new UpdateAgendamentoUseCase(agendamentoRepo, auditRepo);

  beforeEach(() => jest.clearAllMocks());

  const novaData = new Date('2025-07-01T14:00:00Z');

  it('deve atualizar agendamento com sucesso', async () => {
    const existing = makeAgendamento();
    const updated = makeAgendamento({ data: novaData });
    agendamentoRepo.findById.mockResolvedValue(existing);
    agendamentoRepo.findConflict.mockResolvedValue(null);
    agendamentoRepo.update.mockResolvedValue(updated);
    auditRepo.create.mockResolvedValue(undefined);

    const result = await useCase.execute('agendamento-id-1', { data: novaData }, 'medico@afya.com');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toBe(updated);
    expect(auditRepo.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar Left 404 quando agendamento não for encontrado', async () => {
    agendamentoRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('id-inexistente', { data: novaData }, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(404);
  });

  it('deve retornar Left 409 quando houver conflito de horário', async () => {
    agendamentoRepo.findById.mockResolvedValue(makeAgendamento());
    agendamentoRepo.findConflict.mockResolvedValue(makeAgendamento({ id: 'outro-id' }));

    const result = await useCase.execute('agendamento-id-1', { data: novaData }, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(409);
    expect(agendamentoRepo.update).not.toHaveBeenCalled();
  });

  it('deve retornar Left 500 quando update retornar null', async () => {
    agendamentoRepo.findById.mockResolvedValue(makeAgendamento());
    agendamentoRepo.findConflict.mockResolvedValue(null);
    agendamentoRepo.update.mockResolvedValue(null);

    const result = await useCase.execute('agendamento-id-1', { data: novaData }, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(500);
  });

  it('deve atualizar apenas o motivo sem verificar conflito de horário', async () => {
    const existing = makeAgendamento();
    const updated = makeAgendamento({ motivo: 'Retorno' });
    agendamentoRepo.findById.mockResolvedValue(existing);
    agendamentoRepo.update.mockResolvedValue(updated);
    auditRepo.create.mockResolvedValue(undefined);

    const result = await useCase.execute('agendamento-id-1', { motivo: 'Retorno' }, 'medico@afya.com');

    expect(result.isRight()).toBe(true);
    expect(agendamentoRepo.findConflict).not.toHaveBeenCalled();
  });
});
