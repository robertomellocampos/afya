import { Paciente } from '../../domain/entities/Paciente';
import { Agendamento } from '../../domain/entities/Agendamento';
import { PacienteNote } from '../../domain/entities/PacienteNote';
import { Usuario } from '../../domain/entities/Usuario';

export function makePaciente(overrides?: Partial<Parameters<typeof Paciente.fromPrisma>[0]>): Paciente {
  return Paciente.fromPrisma({
    id: 'paciente-id-1',
    nome: 'João Silva',
    telefone: '11999999999',
    email: 'joao@test.com',
    dataNascimento: new Date('1990-01-01'),
    sexo: 'M',
    peso: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}

export function makeAgendamento(overrides?: Partial<Parameters<typeof Agendamento.fromPrisma>[0]>): Agendamento {
  return Agendamento.fromPrisma({
    id: 'agendamento-id-1',
    pacienteId: 'paciente-id-1',
    data: new Date('2025-06-01T10:00:00Z'),
    motivo: 'Consulta de rotina',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}

export function makePacienteNote(overrides?: Partial<Parameters<typeof PacienteNote.fromPrisma>[0]>): PacienteNote {
  return PacienteNote.fromPrisma({
    id: 'note-id-1',
    pacienteId: 'paciente-id-1',
    agendamentoId: 'agendamento-id-1',
    nota: 'Paciente apresentou melhora.',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}

export function makeUsuario(overrides?: Partial<Parameters<typeof Usuario.fromPrisma>[0]>): Usuario {
  return Usuario.fromPrisma({
    id: 'usuario-id-1',
    nome: 'Dr. Teste',
    email: 'teste@afya.com',
    senha: '$2b$10$hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });
}
