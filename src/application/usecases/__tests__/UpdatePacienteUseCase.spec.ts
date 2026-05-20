import 'reflect-metadata';
import { UpdatePacienteUseCase } from '../UpdatePacienteUseCase';
import { makePacienteRepositoryMock, makeAuditLogRepositoryMock } from '../../../shared/test/mocks';
import { makePaciente } from '../../../shared/test/factories';

describe('UpdatePacienteUseCase', () => {
  const pacienteRepo = makePacienteRepositoryMock();
  const auditRepo = makeAuditLogRepositoryMock();
  const useCase = new UpdatePacienteUseCase(pacienteRepo, auditRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve atualizar paciente com sucesso', async () => {
    const existing = makePaciente();
    const updated = makePaciente({ nome: 'João Atualizado' });
    pacienteRepo.findById.mockResolvedValue(existing);
    pacienteRepo.update.mockResolvedValue(updated);
    auditRepo.create.mockResolvedValue(undefined);

    const result = await useCase.execute('paciente-id-1', { nome: 'João Atualizado' }, 'medico@afya.com');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toBe(updated);
    expect(auditRepo.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar Left 404 quando paciente não for encontrado', async () => {
    pacienteRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('id-inexistente', { nome: 'X' }, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(404);
    expect(pacienteRepo.update).not.toHaveBeenCalled();
  });

  it('deve retornar Left 500 quando update retornar null', async () => {
    const existing = makePaciente();
    pacienteRepo.findById.mockResolvedValue(existing);
    pacienteRepo.update.mockResolvedValue(null);

    const result = await useCase.execute('paciente-id-1', { nome: 'X' }, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(500);
  });
});
