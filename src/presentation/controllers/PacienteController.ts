import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePacienteUseCase } from "../../application/usecases/CreatePacienteUseCase";
import { ListPacientesUseCase } from "../../application/usecases/ListPacientesUseCase";
import { UpdatePacienteUseCase } from "../../application/usecases/UpdatePacienteUseCase";
import { createPacienteSchema, updatePacienteSchema } from "../validators/pacienteValidator";
import { AppError } from "../../shared/errors/AppError";

export class PacienteController {
  public async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createPacienteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }

    const useCase = container.resolve(CreatePacienteUseCase);
    const dto = parseResult.data;
    const result = await useCase.execute({
      nome: dto.nome,
      telefone: dto.telefone,
      email: dto.email,
      dataNascimento: new Date(dto.dataNascimento),
      sexo: dto.sexo,
      peso: dto.peso,
    });

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(201).json(result.getValue());
  }

  public async list(_req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(ListPacientesUseCase);
    const result = await useCase.execute();
    return res.status(200).json(result.getValue());
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const parseResult = updatePacienteSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.errors });
    }

    const useCase = container.resolve(UpdatePacienteUseCase);
    const dto = parseResult.data;
    const result = await useCase.execute(req.params.id, {
      nome: dto.nome,
      telefone: dto.telefone,
      email: dto.email,
      dataNascimento: dto.dataNascimento ? new Date(dto.dataNascimento) : undefined,
      sexo: dto.sexo,
      peso: dto.peso,
    });

    if (result.isLeft()) {
      const error = result.getValue();
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(200).json(result.getValue());
  }
}
