import { z } from 'zod';

export const createAgendamentoSchema = z.object({
  pacienteId: z.string().min(1, 'PacienteId é obrigatório'),
  data: z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: 'Data inválida' }),
  motivo: z.string().optional(),
});

export const updateAgendamentoSchema = z
  .object({
    data: z
      .string()
      .refine((v) => !Number.isNaN(Date.parse(v)), { message: 'Data inválida' })
      .optional(),
    motivo: z.string().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, { message: 'Pelo menos um campo deve ser enviado para atualização' });
