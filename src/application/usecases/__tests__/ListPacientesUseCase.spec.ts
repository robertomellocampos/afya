import 'reflect-metadata';
import { ListPacientesUseCase } from '../ListPacientesUseCase';
import { makePacienteRepositoryMock } from '../../../shared/test/mocks';
import { makePaciente } from '../../../shared/test/factories';

describe('ListPacientesUseCase', () => {
  const pacienteRepo = makePacienteRepositoryMock();
  const useCase = new ListPacientesUseCase(pacienteRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve retornar lista de pacientes', async () => {
    const pacientes = [makePaciente(), makePaciente({ id: 'paciente-id-2', email: 'maria@test.com' })];
    pacienteRepo.findAll.mockResolvedValue(pacientes);

    const result = await useCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual(pacientes);
    expect(pacienteRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('deve retornar lista vazia quando não houver pacientes', async () => {
    pacienteRepo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual([]);
  });
});
