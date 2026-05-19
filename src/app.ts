import 'reflect-metadata';
import './shared/container';
import express from 'express';
import { json } from 'express';
import swaggerUi from 'swagger-ui-express';
import { pacienteRoutes } from './presentation/routes/paciente.routes';
import { agendamentoRoutes } from './presentation/routes/agendamento.routes';
import { pacienteNoteRoutes } from './presentation/routes/pacienteNote.routes';
import { authRoutes } from './presentation/routes/auth.routes';
import { swaggerDocument } from './infra/swagger/swaggerConfig';

const app = express();

app.use(json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);
app.use('/pacientes', pacienteRoutes);
app.use('/agendamentos', agendamentoRoutes);
app.use('/paciente-notes', pacienteNoteRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof Error && err.name === 'ZodError') {
    return res.status(400).json({ message: (err as any).errors });
  }
  return res.status(500).json({ message: 'Internal server error' });
});

export { app };
