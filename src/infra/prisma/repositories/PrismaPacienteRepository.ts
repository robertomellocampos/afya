import { injectable } from "tsyringe";
import { prisma } from "../prismaClient";
import { Paciente } from "../../../domain/entities/Paciente";
import { PacienteRepository, CreatePacienteData, UpdatePacienteData } from "../../../domain/repositories/PacienteRepository";

@injectable()
export class PrismaPacienteRepository implements PacienteRepository {
  public async create(data: CreatePacienteData): Promise<Paciente> {
    const paciente = await prisma.paciente.create({
      data: {
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        dataNascimento: data.dataNascimento,
        sexo: data.sexo,
        peso: data.peso,
      },
    });

    return Paciente.create({
      id: paciente.id,
      nome: paciente.nome,
      telefone: paciente.telefone,
      email: paciente.email,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo as "M" | "F" | "O",
      peso: paciente.peso,
      createdAt: paciente.createdAt,
      updatedAt: paciente.updatedAt,
    });
  }

  public async findAll(): Promise<Paciente[]> {
    const pacientes = await prisma.paciente.findMany({
      orderBy: { createdAt: "desc" },
    });

    return pacientes.map((paciente: any) =>
      Paciente.create({
        id: paciente.id,
        nome: paciente.nome,
        telefone: paciente.telefone,
        email: paciente.email,
        dataNascimento: paciente.dataNascimento,
        sexo: paciente.sexo as "M" | "F" | "O",
        peso: paciente.peso,
        createdAt: paciente.createdAt,
        updatedAt: paciente.updatedAt,
      }),
    );
  }

  public async findById(id: string): Promise<Paciente | null> {
    const paciente = await prisma.paciente.findUnique({ where: { id } });
    if (!paciente) {
      return null;
    }

    return Paciente.create({
      id: paciente.id,
      nome: paciente.nome,
      telefone: paciente.telefone,
      email: paciente.email,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo as "M" | "F" | "O",
      peso: paciente.peso,
      createdAt: paciente.createdAt,
      updatedAt: paciente.updatedAt,
    });
  }

  public async update(id: string, data: UpdatePacienteData): Promise<Paciente | null> {
    const updateData: Record<string, unknown> = {};

    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.telefone !== undefined) updateData.telefone = data.telefone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.dataNascimento !== undefined) updateData.dataNascimento = data.dataNascimento;
    if (data.sexo !== undefined) updateData.sexo = data.sexo;
    if (data.peso !== undefined) updateData.peso = data.peso;

    const paciente = await prisma.paciente.update({
      where: { id },
      data: updateData,
    });

    return Paciente.create({
      id: paciente.id,
      nome: paciente.nome,
      telefone: paciente.telefone,
      email: paciente.email,
      dataNascimento: paciente.dataNascimento,
      sexo: paciente.sexo as "M" | "F" | "O",
      peso: paciente.peso,
      createdAt: paciente.createdAt,
      updatedAt: paciente.updatedAt,
    });
  }
}
