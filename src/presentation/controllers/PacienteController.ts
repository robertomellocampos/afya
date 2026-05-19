import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreatePacienteUseCase } from '../../application/usecases/CreatePacienteUseCase';
import { ListPacientesUseCase } from '../../application/usecases/ListPacientesUseCase';
import { ListPacientesPaginatedUseCase } from '../../application/usecases/ListPacientesPaginatedUseCase';
import { UpdatePacienteUseCase } from '../../application/usecases/UpdatePacienteUseCase';
import { AnonymizePacienteUseCase } from '../../application/usecases/AnonymizePacienteUseCase';
import { createPacienteSchema, updatePacienteSchema } from '../validators/pacienteValidator';

@injectable()
export class PacienteController {
  constructor(
    private readonly createPacienteUseCase: CreatePacienteUseCase,
    private readonly listPacientesUseCase: ListPacientesUseCase,
    private readonly listPacientesPaginatedUseCase: ListPacientesPaginatedUseCase,
    private readonly updatePacienteUseCase: UpdatePacienteUseCase,
    private readonly anonymizePacienteUseCase: AnonymizePacienteUseCase
  ) {}

  public async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createPacienteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }

    const dto = parseResult.data;
    const result = await this.createPacienteUseCase.execute(
      {
        nome: dto.nome,
        telefone: dto.telefone,
        email: dto.email,
        dataNascimento: new Date(dto.dataNascimento),
        sexo: dto.sexo,
        peso: dto.peso,
      },
      req.usuarioEmail
    );

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(201).json(result.getValue());
  }

  public async list(_req: Request, res: Response): Promise<Response> {
    const result = await this.listPacientesUseCase.execute();
    return res.status(200).json(result.getValue());
  }

  public async listPaginated(req: Request, res: Response): Promise<Response> {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10;
    const result = await this.listPacientesPaginatedUseCase.execute({ page, pageSize });
    return res.status(200).json(result.getValue());
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const parseResult = updatePacienteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }

    const dto = parseResult.data;
    const result = await this.updatePacienteUseCase.execute(
      req.params.id,
      {
        nome: dto.nome,
        telefone: dto.telefone,
        email: dto.email,
        dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : undefined,
        sexo: dto.sexo,
        peso: dto.peso,
      },
      req.usuarioEmail
    );

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(200).json(result.getValue());
  }

  public async anonymize(req: Request, res: Response): Promise<Response> {
    const result = await this.anonymizePacienteUseCase.execute(req.params.id, req.usuarioEmail);
    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(200).json({ message: 'Dados pessoais do paciente removidos conforme LGPD' });
  }
}
