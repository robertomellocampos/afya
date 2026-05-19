import express from 'express';
import { json } from 'express';
import { pacienteRoutes } from './presentation/routes/paciente.routes';
import { agendamentoRoutes } from './presentation/routes/agendamento.routes';
import 'reflect-metadata';
import './shared/container';

const app = express();

app.use(json());
app.use('/pacientes', pacienteRoutes);
app.use('/agendamentos', agendamentoRoutes);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof Error && err.name === 'ZodError') {
    return res.status(400).json({ message: (err as any).errors });
  }
  return res.status(500).json({ message: 'Internal server error' });
});

export { app };
