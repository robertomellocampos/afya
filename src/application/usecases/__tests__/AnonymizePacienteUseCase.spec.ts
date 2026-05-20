import 'reflect-metadata';
import { AnonymizePacienteUseCase } from '../AnonymizePacienteUseCase';
import { makePacienteRepositoryMock, makeAuditLogRepositoryMock } from '../../../shared/test/mocks';
import { makePaciente } from '../../../shared/test/factories';

describe('AnonymizePacienteUseCase', () => {
  const pacienteRepo = makePacienteRepositoryMock();
  const auditRepo = makeAuditLogRepositoryMock();
  const useCase = new AnonymizePacienteUseCase(pacienteRepo, auditRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve anonimizar paciente com sucesso', async () => {
    const existing = makePaciente();
    const anonymized = makePaciente({
      nome: 'REMOVIDO',
      telefone: '00000000000',
      email: 'removido-paciente-id-1@lgpd.com',
      dataNascimento: new Date('1900-01-01'),
      sexo: 'O',
      peso: 1,
    });
    pacienteRepo.findById.mockResolvedValue(existing);
    pacienteRepo.update.mockResolvedValue(anonymized);
    auditRepo.create.mockResolvedValue(undefined);

    const result = await useCase.execute('paciente-id-1', 'medico@afya.com');

    expect(result.isRight()).toBe(true);
    expect(pacienteRepo.update).toHaveBeenCalledTimes(1);
    expect(auditRepo.create).toHaveBeenCalledTimes(1);

    const auditArg = auditRepo.create.mock.calls[0][0];
    const dados = JSON.parse(auditArg.dadosAlterados);
    expect(dados.after).toBe('ANONIMIZADO');
  });

  it('deve retornar Left 404 quando paciente não for encontrado', async () => {
    pacienteRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('id-inexistente', 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(404);
    expect(pacienteRepo.update).not.toHaveBeenCalled();
  });

  it('deve retornar Left 500 quando update retornar null', async () => {
    pacienteRepo.findById.mockResolvedValue(makePaciente());
    pacienteRepo.update.mockResolvedValue(null);

    const result = await useCase.execute('paciente-id-1', 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(500);
  });
});
