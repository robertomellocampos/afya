import { z } from 'zod';

export const createPacienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  dataNascimento: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Data de nascimento inválida',
  }),
  sexo: z.enum(['M', 'F', 'O']),
  peso: z.number().positive('Peso deve ser maior que zero'),
});

export const updatePacienteSchema = z
  .object({
    nome: z.string().min(1).optional(),
    telefone: z.string().min(1).optional(),
    email: z.string().email('Email inválido').optional(),
    dataNascimento: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'Data de nascimento inválida',
      })
      .optional(),
    sexo: z.enum(['M', 'F', 'O']).optional(),
    peso: z.number().positive('Peso deve ser maior que zero').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Pelo menos um campo deve ser enviado para atualização',
  });
