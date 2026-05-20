import 'reflect-metadata';
import { ListPacienteNotesByPacienteUseCase } from '../ListPacienteNotesByPacienteUseCase';
import { makePacienteNoteRepositoryMock, makePacienteRepositoryMock } from '../../../shared/test/mocks';
import { makePaciente, makePacienteNote } from '../../../shared/test/factories';

describe('ListPacienteNotesByPacienteUseCase', () => {
  const noteRepo = makePacienteNoteRepositoryMock();
  const pacienteRepo = makePacienteRepositoryMock();
  const useCase = new ListPacienteNotesByPacienteUseCase(noteRepo, pacienteRepo);

  beforeEach(() => jest.clearAllMocks());

  it('deve retornar as notas do paciente', async () => {
    const notes = [makePacienteNote(), makePacienteNote({ id: 'note-id-2' })];
    pacienteRepo.findById.mockResolvedValue(makePaciente());
    noteRepo.findByPacienteId.mockResolvedValue(notes);

    const result = await useCase.execute('paciente-id-1');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual(notes);
    expect(noteRepo.findByPacienteId).toHaveBeenCalledWith('paciente-id-1');
  });

  it('deve retornar lista vazia quando paciente não tiver notas', async () => {
    pacienteRepo.findById.mockResolvedValue(makePaciente());
    noteRepo.findByPacienteId.mockResolvedValue([]);

    const result = await useCase.execute('paciente-id-1');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toEqual([]);
  });

  it('deve retornar Left 404 quando paciente não for encontrado', async () => {
    pacienteRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute('id-inexistente');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(404);
    expect(noteRepo.findByPacienteId).not.toHaveBeenCalled();
  });
});
