import { Router } from 'express';
import { container } from 'tsyringe';
import { PacienteController } from '../controllers/PacienteController';

const pacienteRoutes = Router();
const controller = container.resolve(PacienteController);

pacienteRoutes.post('/', controller.create.bind(controller));
pacienteRoutes.get('/paginated', controller.listPaginated.bind(controller));
pacienteRoutes.get('/', controller.list.bind(controller));
pacienteRoutes.put('/:id', controller.update.bind(controller));

export { pacienteRoutes };
