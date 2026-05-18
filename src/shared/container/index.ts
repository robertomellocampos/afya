import { container } from "tsyringe";
import { PacienteRepository } from "../../domain/repositories/PacienteRepository";
import { PrismaPacienteRepository } from "../../infra/prisma/repositories/PrismaPacienteRepository";

container.registerSingleton<PacienteRepository>("PacienteRepository", PrismaPacienteRepository);
