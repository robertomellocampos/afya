import { Router } from 'express';
import { container } from 'tsyringe';
import { PacienteController } from '../controllers/PacienteController';
import { authMiddleware } from '../middlewares/authMiddleware';

const pacienteRoutes = Router();
const controller = container.resolve(PacienteController);

pacienteRoutes.use(authMiddleware);

pacienteRoutes.post('/', controller.create.bind(controller));
pacienteRoutes.get('/paginated', controller.listPaginated.bind(controller));
pacienteRoutes.get('/', controller.list.bind(controller));
pacienteRoutes.put('/:id', controller.update.bind(controller));
pacienteRoutes.delete('/:id', controller.anonymize.bind(controller));

export { pacienteRoutes };
