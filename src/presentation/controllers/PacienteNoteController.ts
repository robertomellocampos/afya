import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreatePacienteNoteUseCase } from '../../application/usecases/CreatePacienteNoteUseCase';
import { ListPacienteNotesByPacienteUseCase } from '../../application/usecases/ListPacienteNotesByPacienteUseCase';
import { createPacienteNoteSchema } from '../validators/pacienteNoteValidator';

@injectable()
export class PacienteNoteController {
  constructor(
    private readonly createPacienteNoteUseCase: CreatePacienteNoteUseCase,
    private readonly listPacienteNotesByPacienteUseCase: ListPacienteNotesByPacienteUseCase
  ) {}

  public async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createPacienteNoteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }

    const result = await this.createPacienteNoteUseCase.execute(
      { agendamentoId: parseResult.data.agendamentoId, nota: parseResult.data.nota },
      req.usuarioEmail
    );

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(201).json(result.getValue());
  }

  public async listByPaciente(req: Request, res: Response): Promise<Response> {
    const result = await this.listPacienteNotesByPacienteUseCase.execute(req.params.pacienteId);

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(200).json(result.getValue());
  }
}
