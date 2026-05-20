import { PacienteRepository } from '../../domain/repositories/PacienteRepository';
import { AgendamentoRepository } from '../../domain/repositories/AgendamentoRepository';
import { PacienteNoteRepository } from '../../domain/repositories/PacienteNoteRepository';
import { AuditLogRepository } from '../../domain/repositories/AuditLogRepository';
import { UsuarioRepository } from '../../domain/repositories/UsuarioRepository';
import { Log } from '../log/Log';
import { JwtService } from '../../infra/auth/JwtService';

export function makePacienteRepositoryMock(): jest.Mocked<PacienteRepository> {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPaginated: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
  };
}

export function makeAgendamentoRepositoryMock(): jest.Mocked<AgendamentoRepository> {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPaginated: jest.fn(),
    findById: jest.fn(),
    findConflict: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
}

export function makePacienteNoteRepositoryMock(): jest.Mocked<PacienteNoteRepository> {
  return {
    create: jest.fn(),
    findByPacienteId: jest.fn(),
  };
}

export function makeAuditLogRepositoryMock(): jest.Mocked<AuditLogRepository> {
  return {
    create: jest.fn(),
  };
}

export function makeUsuarioRepositoryMock(): jest.Mocked<UsuarioRepository> {
  return {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };
}

export function makeLogMock(): jest.Mocked<Log> {
  return {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  };
}

export function makeJwtServiceMock(): jest.Mocked<JwtService> {
  return {
    sign: jest.fn(),
    verify: jest.fn(),
  };
}
