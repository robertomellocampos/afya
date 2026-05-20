import 'reflect-metadata';
import { CreatePacienteUseCase } from '../CreatePacienteUseCase';
import {
  makePacienteRepositoryMock,
  makeAuditLogRepositoryMock,
  makeLogMock,
} from '../../../shared/test/mocks';
import { makePaciente } from '../../../shared/test/factories';

describe('CreatePacienteUseCase', () => {
  const pacienteRepo = makePacienteRepositoryMock();
  const auditRepo = makeAuditLogRepositoryMock();
  const logger = makeLogMock();
  const useCase = new CreatePacienteUseCase(pacienteRepo, auditRepo, logger);

  beforeEach(() => jest.clearAllMocks());

  const input = {
    nome: 'João Silva',
    telefone: '11999999999',
    email: 'joao@test.com',
    dataNascimento: new Date('1990-01-01'),
    sexo: 'M',
    peso: 75,
  };

  it('deve criar paciente com sucesso', async () => {
    const paciente = makePaciente();
    pacienteRepo.create.mockResolvedValue(paciente);
    auditRepo.create.mockResolvedValue(undefined);

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toBe(paciente);
    expect(pacienteRepo.create).toHaveBeenCalledTimes(1);
    expect(auditRepo.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar Left quando o campo email for inválido', async () => {
    const result = await useCase.execute({ ...input, email: 'invalido' }, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(400);
    expect(pacienteRepo.create).not.toHaveBeenCalled();
  });

  it('deve retornar Left 500 quando o repositório lançar um erro inesperado', async () => {
    pacienteRepo.create.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(500);
  });
});
