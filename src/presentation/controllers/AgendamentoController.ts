import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateAgendamentoUseCase } from '../../application/usecases/CreateAgendamentoUseCase';
import { ListAgendamentosUseCase } from '../../application/usecases/ListAgendamentosUseCase';
import { ListAgendamentosPaginatedUseCase } from '../../application/usecases/ListAgendamentosPaginatedUseCase';
import { UpdateAgendamentoUseCase } from '../../application/usecases/UpdateAgendamentoUseCase';
import { DeleteAgendamentoUseCase } from '../../application/usecases/DeleteAgendamentoUseCase';
import { createAgendamentoSchema, updateAgendamentoSchema } from '../validators/agendamentoValidator';

@injectable()
export class AgendamentoController {
  constructor(
    private readonly createAgendamentoUseCase: CreateAgendamentoUseCase,
    private readonly listAgendamentosUseCase: ListAgendamentosUseCase,
    private readonly listAgendamentosPaginatedUseCase: ListAgendamentosPaginatedUseCase,
    private readonly updateAgendamentoUseCase: UpdateAgendamentoUseCase,
    private readonly deleteAgendamentoUseCase: DeleteAgendamentoUseCase
  ) {}

  public async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createAgendamentoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }

    const dto = parseResult.data;
    const result = await this.createAgendamentoUseCase.execute(
      { pacienteId: dto.pacienteId, data: new Date(dto.data), motivo: dto.motivo },
      req.usuarioEmail
    );

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(201).json(result.getValue());
  }

  public async list(_req: Request, res: Response): Promise<Response> {
    const result = await this.listAgendamentosUseCase.execute();
    return res.status(200).json(result.getValue());
  }

  public async listPaginated(req: Request, res: Response): Promise<Response> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    const result = await this.listAgendamentosPaginatedUseCase.execute({ page, pageSize });
    return res.status(200).json(result.getValue());
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const parseResult = updateAgendamentoSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }
    const dto = parseResult.data;
    const result = await this.updateAgendamentoUseCase.execute(
      req.params.id,
      { data: dto.data ? new Date(dto.data) : undefined, motivo: dto.motivo },
      req.usuarioEmail
    );

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(200).json(result.getValue());
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const result = await this.deleteAgendamentoUseCase.execute(req.params.id);
    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(204).send();
  }
}
