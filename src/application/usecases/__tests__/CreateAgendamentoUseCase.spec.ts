import 'reflect-metadata';
import { CreateAgendamentoUseCase } from '../CreateAgendamentoUseCase';
import {
  makeAgendamentoRepositoryMock,
  makeAuditLogRepositoryMock,
  makeLogMock,
} from '../../../shared/test/mocks';
import { makeAgendamento } from '../../../shared/test/factories';

describe('CreateAgendamentoUseCase', () => {
  const agendamentoRepo = makeAgendamentoRepositoryMock();
  const auditRepo = makeAuditLogRepositoryMock();
  const logger = makeLogMock();
  const useCase = new CreateAgendamentoUseCase(agendamentoRepo, auditRepo, logger);

  beforeEach(() => jest.clearAllMocks());

  const input = {
    pacienteId: 'paciente-id-1',
    data: new Date('2025-06-01T10:00:00Z'),
    motivo: 'Consulta de rotina',
  };

  it('deve criar agendamento com sucesso', async () => {
    const agendamento = makeAgendamento();
    agendamentoRepo.findConflict.mockResolvedValue(null);
    agendamentoRepo.create.mockResolvedValue(agendamento);
    auditRepo.create.mockResolvedValue(undefined);

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toBe(agendamento);
    expect(agendamentoRepo.create).toHaveBeenCalledTimes(1);
    expect(auditRepo.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar Left 409 quando já houver um agendamento no mesmo horário', async () => {
    agendamentoRepo.findConflict.mockResolvedValue(makeAgendamento());

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(409);
    expect(agendamentoRepo.create).not.toHaveBeenCalled();
  });

  it('deve retornar Left 500 quando o repositório lançar um erro inesperado', async () => {
    agendamentoRepo.findConflict.mockResolvedValue(null);
    agendamentoRepo.create.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(500);
  });
});
