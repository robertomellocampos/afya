import { injectable } from 'tsyringe';
import { prisma } from '../prismaClient';
import { Paciente } from '../../../domain/entities/Paciente';
import { PacienteRepository } from '../../../domain/repositories/PacienteRepository';
import { PaginationParams, PaginationResult } from '../../../shared/types/Pagination';

@injectable()
export class PrismaPacienteRepository implements PacienteRepository {
  public async create(pacienteEntity: Paciente): Promise<Paciente> {
    const paciente = await prisma.paciente.create({
      data: {
        nome: pacienteEntity.nome,
        telefone: pacienteEntity.telefone,
        email: pacienteEntity.email,
        dataNascimento: pacienteEntity.dataNascimento,
        sexo: pacienteEntity.sexo,
        peso: pacienteEntity.peso,
      },
    });

    return Paciente.fromPrisma({
      id: paciente.id,
      nome: paciente.nome,
      telefone: paciente.telefone,
      email: paciente.email,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo as 'M' | 'F' | 'O',
      peso: paciente.peso,
      createdAt: paciente.createdAt,
      updatedAt: paciente.updatedAt,
    });
  }

  public async findAll(): Promise<Paciente[]> {
    const pacientes = await prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return pacientes.map((paciente: any) =>
      Paciente.fromPrisma({
        id: paciente.id,
        nome: paciente.nome,
        telefone: paciente.telefone,
        email: paciente.email,
        dataNascimento: paciente.dataNascimento,
        sexo: paciente.sexo as 'M' | 'F' | 'O',
        peso: paciente.peso,
        createdAt: paciente.createdAt,
        updatedAt: paciente.updatedAt,
      })
    );
  }

  public async findAllPaginated(params: PaginationParams): Promise<PaginationResult<Paciente>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [pacientes, total] = await Promise.all([
      prisma.paciente.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.paciente.count(),
    ]);

    const data = pacientes.map((paciente: any) =>
      Paciente.fromPrisma({
        id: paciente.id,
        nome: paciente.nome,
        telefone: paciente.telefone,
        email: paciente.email,
        dataNascimento: paciente.dataNascimento,
        sexo: paciente.sexo as 'M' | 'F' | 'O',
        peso: paciente.peso,
        createdAt: paciente.createdAt,
        updatedAt: paciente.updatedAt,
      })
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public async findById(id: string): Promise<Paciente | null> {
    const paciente = await prisma.paciente.findUnique({ where: { id } });
    if (!paciente) {
      return null;
    }

    return Paciente.fromPrisma({
      id: paciente.id,
      nome: paciente.nome,
      telefone: paciente.telefone,
      email: paciente.email,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo as 'M' | 'F' | 'O',
      peso: paciente.peso,
      createdAt: paciente.createdAt,
      updatedAt: paciente.updatedAt,
    });
  }

  public async update(pacienteEntity: Paciente): Promise<Paciente | null> {
    const paciente = await prisma.paciente.update({
      where: { id: pacienteEntity.id },
      data: {
        nome: pacienteEntity.nome,
        telefone: pacienteEntity.telefone,
        email: pacienteEntity.email,
        dataNascimento: pacienteEntity.dataNascimento,
        sexo: pacienteEntity.sexo,
        peso: pacienteEntity.peso,
      },
    });

    return Paciente.fromPrisma({
      id: paciente.id,
      nome: paciente.nome,
      telefone: paciente.telefone,
      email: paciente.email,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo as 'M' | 'F' | 'O',
      peso: paciente.peso,
      createdAt: paciente.createdAt,
      updatedAt: paciente.updatedAt,
    });
  }
}
