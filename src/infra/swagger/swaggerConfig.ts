const bearerAuth = { BearerAuth: [] };

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Afya API',
    version: '1.0.0',
    description: 'API de gestão de consultas médicas',
  },
  tags: [
    { name: 'Auth', description: 'Autenticação' },
    { name: 'Pacientes', description: 'Gestão de pacientes' },
    { name: 'Agendamentos', description: 'Gestão de consultas' },
    { name: 'Anotações', description: 'Anotações do médico por paciente' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterBody: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome: { type: 'string', example: 'Dr. Roberto' },
          email: { type: 'string', format: 'email', example: 'dr.roberto@afya.com' },
          senha: { type: 'string', minLength: 6, example: 'senha123' },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: { type: 'string', format: 'email', example: 'teste@afya.com' },
          senha: { type: 'string', example: 'teste123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      Paciente: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string', example: 'João Silva' },
          telefone: { type: 'string', example: '11999999999' },
          email: { type: 'string', format: 'email', example: 'joao@email.com' },
          dataNascimento: { type: 'string', format: 'date-time' },
          sexo: { type: 'string', enum: ['M', 'F', 'O'] },
          peso: { type: 'number', example: 75.5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePacienteBody: {
        type: 'object',
        required: ['nome', 'telefone', 'email', 'dataNascimento', 'sexo', 'peso'],
        properties: {
          nome: { type: 'string', example: 'João Silva' },
          telefone: { type: 'string', example: '11999999999' },
          email: { type: 'string', format: 'email', example: 'joao@email.com' },
          dataNascimento: { type: 'string', example: '1990-05-20' },
          sexo: { type: 'string', enum: ['M', 'F', 'O'] },
          peso: { type: 'number', example: 75.5 },
        },
      },
      UpdatePacienteBody: {
        type: 'object',
        properties: {
          nome: { type: 'string', example: 'João Silva' },
          telefone: { type: 'string', example: '11999999999' },
          email: { type: 'string', format: 'email', example: 'joao@email.com' },
          dataNascimento: { type: 'string', example: '1990-05-20' },
          sexo: { type: 'string', enum: ['M', 'F', 'O'] },
          peso: { type: 'number', example: 75.5 },
        },
      },
      Agendamento: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          pacienteId: { type: 'string', format: 'uuid' },
          data: { type: 'string', format: 'date-time' },
          motivo: { type: 'string', nullable: true, example: 'Dor de cabeça recorrente' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateAgendamentoBody: {
        type: 'object',
        required: ['pacienteId', 'data'],
        properties: {
          pacienteId: { type: 'string', format: 'uuid' },
          data: { type: 'string', example: '2026-06-15T10:00:00.000Z' },
          motivo: { type: 'string', example: 'Dor de cabeça recorrente' },
        },
      },
      UpdateAgendamentoBody: {
        type: 'object',
        properties: {
          data: { type: 'string', example: '2026-06-20T14:00:00.000Z' },
          motivo: { type: 'string', example: 'Reagendamento a pedido do paciente' },
        },
      },
      PacienteNote: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          pacienteId: { type: 'string', format: 'uuid' },
          agendamentoId: { type: 'string', format: 'uuid' },
          nota: { type: 'string', example: 'Paciente relata dor ao caminhar há 3 dias.' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreatePacienteNoteBody: {
        type: 'object',
        required: ['agendamentoId', 'nota'],
        properties: {
          agendamentoId: { type: 'string', format: 'uuid' },
          nota: { type: 'string', example: 'Paciente relata dor ao caminhar há 3 dias.' },
        },
      },
      PaginationResult: {
        type: 'object',
        properties: {
          data: { type: 'array', items: {} },
          total: { type: 'integer' },
          page: { type: 'integer' },
          pageSize: { type: 'integer' },
          totalPages: { type: 'integer' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
      ValidationErrorResponse: {
        type: 'object',
        properties: { errors: { type: 'array', items: { type: 'object' } } },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cadastrar usuário',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } },
        },
        responses: {
          201: { description: 'Usuário criado' },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } },
          409: { description: 'Email já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login — retorna JWT',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
        },
        responses: {
          200: { description: 'Token JWT', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          401: { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/pacientes': {
      post: {
        tags: ['Pacientes'],
        summary: 'Cadastrar paciente',
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePacienteBody' } } },
        },
        responses: {
          201: { description: 'Paciente criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Paciente' } } } },
          400: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/ValidationErrorResponse' } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      get: {
        tags: ['Pacientes'],
        summary: 'Listar todos os pacientes',
        security: [bearerAuth],
        responses: {
          200: { description: 'Lista de pacientes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Paciente' } } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/pacientes/paginated': {
      get: {
        tags: ['Pacientes'],
        summary: 'Listar pacientes paginado',
        security: [bearerAuth],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Lista paginada de pacientes' },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/pacientes/{id}': {
      put: {
        tags: ['Pacientes'],
        summary: 'Atualizar paciente',
        security: [bearerAuth],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdatePacienteBody' } } },
        },
        responses: {
          200: { description: 'Paciente atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Paciente' } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Paciente não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        tags: ['Pacientes'],
        summary: 'Anonimizar dados pessoais (LGPD)',
        security: [bearerAuth],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Dados anonimizados', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Paciente não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/agendamentos': {
      post: {
        tags: ['Agendamentos'],
        summary: 'Cadastrar agendamento',
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAgendamentoBody' } } },
        },
        responses: {
          201: { description: 'Agendamento criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Agendamento' } } } },
          400: { description: 'Dados inválidos' },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Conflito de horário', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      get: {
        tags: ['Agendamentos'],
        summary: 'Listar todos os agendamentos',
        security: [bearerAuth],
        responses: {
          200: { description: 'Lista de agendamentos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Agendamento' } } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/agendamentos/paginated': {
      get: {
        tags: ['Agendamentos'],
        summary: 'Listar agendamentos paginado',
        security: [bearerAuth],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Lista paginada de agendamentos' },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/agendamentos/{id}': {
      put: {
        tags: ['Agendamentos'],
        summary: 'Atualizar agendamento',
        security: [bearerAuth],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateAgendamentoBody' } } },
        },
        responses: {
          200: { description: 'Agendamento atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Agendamento' } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Agendamento não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          409: { description: 'Conflito de horário', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
      delete: {
        tags: ['Agendamentos'],
        summary: 'Excluir agendamento',
        security: [bearerAuth],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          204: { description: 'Agendamento excluído' },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Agendamento não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/paciente-notes': {
      post: {
        tags: ['Anotações'],
        summary: 'Anotar observação durante a consulta',
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePacienteNoteBody' } } },
        },
        responses: {
          201: { description: 'Anotação criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/PacienteNote' } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          404: { description: 'Agendamento não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/paciente-notes/paciente/{pacienteId}': {
      get: {
        tags: ['Anotações'],
        summary: 'Listar anotações de um paciente',
        security: [bearerAuth],
        parameters: [{ name: 'pacienteId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: { description: 'Lista de anotações', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/PacienteNote' } } } } },
          401: { description: 'Não autorizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
  },
};
