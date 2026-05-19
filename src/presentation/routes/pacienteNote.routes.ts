import { Router } from 'express';
import { container } from 'tsyringe';
import { PacienteNoteController } from '../controllers/PacienteNoteController';
import { authMiddleware } from '../middlewares/authMiddleware';

const pacienteNoteRoutes = Router();
const controller = container.resolve(PacienteNoteController);

pacienteNoteRoutes.use(authMiddleware);

pacienteNoteRoutes.post('/', controller.create.bind(controller));
pacienteNoteRoutes.get('/paciente/:pacienteId', controller.listByPaciente.bind(controller));

export { pacienteNoteRoutes };
