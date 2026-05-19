# Afya API

API REST para gestão de consultas médicas — pacientes, agendamentos e anotações clínicas.

---

## Funcionalidades

### Requisitos Funcionais

#### Autenticação
- Cadastro de usuário com senha criptografada (bcrypt)
- Login com geração de token JWT contendo o e-mail do usuário
- Token com expiração de 8 horas
- Todos os endpoints (exceto login e cadastro) exigem autenticação via Bearer Token

#### Pacientes
- Cadastro de paciente com validação dos campos obrigatórios (nome, telefone, e-mail, data de nascimento, sexo, peso)
- Listagem de todos os pacientes
- Listagem paginada de pacientes
- Atualização parcial dos dados do paciente
- Anonimização dos dados pessoais conforme LGPD — o histórico de consultas e anotações é preservado para fins contábeis

#### Agendamentos
- Cadastro de agendamento vinculado a um paciente
- Validação de conflito de horário: impede dois agendamentos na mesma data e hora
- Listagem de todos os agendamentos
- Listagem paginada de agendamentos
- Atualização de agendamento (também valida conflito de horário)
- Exclusão de agendamento

#### Anotações Clínicas
- Registro de anotações do médico vinculadas a um agendamento
- Listagem de todas as anotações de um paciente

#### Auditoria
- Registro automático de ações sensíveis na tabela `AuditLog`
- Ações auditadas: `PACIENTE_CREATE`, `PACIENTE_UPDATE`, `AGENDAMENTO_CREATE`, `AGENDAMENTO_UPDATE`, `PACIENTE_NOTE_CREATE`
- Cada registro contém: e-mail do usuário autenticado, ação realizada, ID da entidade afetada e JSON com os dados alterados (antes/depois)

---

### Requisitos Não Funcionais

#### Arquitetura
- Clean Architecture com separação em camadas: `domain`, `application`, `infra` e `presentation`
- Injeção de dependência via `tsyringe` — repositórios e serviços desacoplados
- Padrão Either Result para tratamento de erros sem exceções não controladas

#### Segurança
- Senhas armazenadas com hash bcrypt (salt 10)
- Autenticação stateless via JWT
- Middleware de autenticação aplicado por roteador — nenhum endpoint protegido é acessível sem token válido
- Variáveis sensíveis (senha do banco, segredo JWT) em arquivo `.env`

#### Banco de Dados
- MySQL 8.0 com Prisma ORM
- Migrations versionadas e controladas pelo Prisma
- Seed idempotente para criação de usuário de teste

#### Validação
- Validação de entrada com Zod nos controllers
- Validação de domínio nas entidades (e-mail, peso, sexo, etc.)

#### Observabilidade
- Log estruturado de operações via `ConsoleLog`
- Verificação de conexão com o banco na inicialização — a API não sobe se o banco estiver indisponível

#### Documentação
- Swagger UI disponível em `/api-docs`
- Todos os endpoints documentados com schemas de request/response
- Autenticação BearerAuth configurada diretamente no Swagger

#### Infraestrutura
- Containerização completa com Docker e Docker Compose
- Banco de dados isolado em volume persistente
- Entrypoint automatizado: migrations → generate → seed → API

---

## Tecnologias

- Node.js + TypeScript
- Express
- Prisma ORM + MySQL
- JWT (autenticação)
- Swagger (documentação)
- Docker + Docker Compose

---

## Como rodar

> **Recomendado:** utilize o Docker. Ele sobe o banco, roda as migrations, gera o client e inicia a API automaticamente.

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **em execução**

### Passo a passo

1. Clone o repositório:

```bash
git clone https://github.com/robertomellocampos/afya.git
cd afya
```

2. Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

> O `.env` já vem configurado para funcionar com o Docker. Não é necessário alterar nada para rodar localmente com Docker.

3. Suba tudo com um único comando:

```bash
npm run docker:up
```

O que acontece automaticamente:
- Banco de dados MySQL é iniciado
- API aguarda o banco ficar disponível
- Migrations são aplicadas (`prisma migrate deploy`)
- Prisma Client é gerado (`prisma generate`)
- Usuário de teste é criado no banco (`db:seed`)
- API sobe na porta `3000`

3. Aguarde a mensagem no terminal:

```
>>> Subindo API...
Conexão com o banco de dados estabelecida com sucesso.
API rodando em http://localhost:3000
```

### Outros comandos Docker

| Comando | Descrição |
|---|---|
| `npm run docker:up` | Builda e sobe os containers |
| `npm run docker:down` | Para e remove os containers |
| `npm run docker:reset` | Remove tudo (inclusive banco) e sobe do zero |

---

## Como rodar localmente (sem Docker)

### Pré-requisitos

- Node.js 20+
- MySQL rodando localmente
- Criar um banco chamado `afya` e um usuário com as credenciais do `.env`

### Passos

```bash
# Copiar variáveis de ambiente
cp .env.example .env
# Ajuste as credenciais do banco no .env conforme seu ambiente local

# Instalar dependências
npm install

# Rodar migrations
npm run db:migrate

# Gerar o Prisma Client
npm run db:generate

# Criar usuário de teste
npm run db:seed

# Subir a API em modo desenvolvimento
npm run dev
```

---

## Acessando o Swagger

Com a API rodando, acesse:

```
http://localhost:3000/api-docs
```

### Como autenticar no Swagger

1. Clique em **Authorize** (ícone de cadeado no topo da página)
2. No campo `BearerAuth`, informe o token JWT obtido no login
3. Clique em **Authorize** e depois em **Close**
4. Todos os endpoints protegidos agora serão enviados com o token automaticamente

---

## Credenciais de teste

Use o endpoint `POST /auth/login` com:

```json
{
  "email": "teste@afya.com",
  "senha": "teste123"
}
```

Copie o `token` retornado e use-o para autenticar no Swagger conforme descrito acima.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia a API em modo desenvolvimento com hot-reload |
| `npm run build` | Compila o TypeScript para JavaScript |
| `npm run start` | Inicia a API compilada |
| `npm run db:migrate` | Cria e aplica novas migrations |
| `npm run db:migrate:prod` | Aplica migrations em produção |
| `npm run db:generate` | Regenera o Prisma Client |
| `npm run db:seed` | Cria o usuário de teste no banco |

---

## Endpoints principais

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | Cadastrar usuário | Não |
| POST | `/auth/login` | Login (retorna JWT) | Não |
| GET | `/pacientes` | Listar pacientes | Sim |
| POST | `/pacientes` | Cadastrar paciente | Sim |
| PUT | `/pacientes/:id` | Atualizar paciente | Sim |
| DELETE | `/pacientes/:id` | Anonimizar dados (LGPD) | Sim |
| GET | `/agendamentos` | Listar agendamentos | Sim |
| POST | `/agendamentos` | Cadastrar agendamento | Sim |
| PUT | `/agendamentos/:id` | Atualizar agendamento | Sim |
| DELETE | `/agendamentos/:id` | Excluir agendamento | Sim |
| POST | `/paciente-notes` | Criar anotação | Sim |
| GET | `/paciente-notes/paciente/:id` | Listar anotações do paciente | Sim |

Para a documentação completa acesse o Swagger em `/api-docs`.
