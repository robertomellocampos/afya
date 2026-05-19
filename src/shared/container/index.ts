import { container } from 'tsyringe';
import { PacienteRepository } from '../../domain/repositories/PacienteRepository';
import { PrismaPacienteRepository } from '../../infra/prisma/repositories/PrismaPacienteRepository';
import { AgendamentoRepository } from '../../domain/repositories/AgendamentoRepository';
import { PrismaAgendamentoRepository } from '../../infra/prisma/repositories/PrismaAgendamentoRepository';
import { Log } from '../log/Log';
import { ConsoleLog } from '../log/ConsoleLog';

container.registerSingleton<PacienteRepository>('PacienteRepository', PrismaPacienteRepository);
container.registerSingleton<AgendamentoRepository>('AgendamentoRepository', PrismaAgendamentoRepository);
container.registerSingleton<Log>('Log', ConsoleLog);
