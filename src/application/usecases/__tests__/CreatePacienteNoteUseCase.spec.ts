import 'reflect-metadata';
import { CreatePacienteNoteUseCase } from '../CreatePacienteNoteUseCase';
import {
  makePacienteNoteRepositoryMock,
  makeAgendamentoRepositoryMock,
  makeAuditLogRepositoryMock,
  makeLogMock,
} from '../../../shared/test/mocks';
import { makePacienteNote, makeAgendamento } from '../../../shared/test/factories';

describe('CreatePacienteNoteUseCase', () => {
  const noteRepo = makePacienteNoteRepositoryMock();
  const agendamentoRepo = makeAgendamentoRepositoryMock();
  const auditRepo = makeAuditLogRepositoryMock();
  const logger = makeLogMock();
  const useCase = new CreatePacienteNoteUseCase(noteRepo, agendamentoRepo, auditRepo, logger);

  beforeEach(() => jest.clearAllMocks());

  const input = {
    agendamentoId: 'agendamento-id-1',
    nota: 'Paciente apresentou melhora.',
  };

  it('deve criar nota clínica com sucesso', async () => {
    const agendamento = makeAgendamento();
    const note = makePacienteNote();
    agendamentoRepo.findById.mockResolvedValue(agendamento);
    noteRepo.create.mockResolvedValue(note);
    auditRepo.create.mockResolvedValue(undefined);

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isRight()).toBe(true);
    expect(result.getValue()).toBe(note);
    expect(noteRepo.create).toHaveBeenCalledTimes(1);
    expect(auditRepo.create).toHaveBeenCalledTimes(1);
  });

  it('deve retornar Left 404 quando agendamento não for encontrado', async () => {
    agendamentoRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(404);
    expect(noteRepo.create).not.toHaveBeenCalled();
  });

  it('deve retornar Left 500 quando o repositório lançar um erro inesperado', async () => {
    agendamentoRepo.findById.mockResolvedValue(makeAgendamento());
    noteRepo.create.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute(input, 'medico@afya.com');

    expect(result.isLeft()).toBe(true);
    expect((result.getValue() as any).statusCode).toBe(500);
  });
});
