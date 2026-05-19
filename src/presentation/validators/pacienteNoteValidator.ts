import { z } from 'zod';

export const createPacienteNoteSchema = z.object({
  agendamentoId: z.string().min(1, 'AgendamentoId é obrigatório'),
  nota: z.string().min(1, 'Nota é obrigatória'),
});
