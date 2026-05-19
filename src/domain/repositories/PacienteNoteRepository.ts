import { PacienteNote } from '../entities/PacienteNote';

export interface PacienteNoteRepository {
  create(note: PacienteNote): Promise<PacienteNote>;
  findByPacienteId(pacienteId: string): Promise<PacienteNote[]>;
}
