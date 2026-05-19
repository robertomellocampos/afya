import { Router } from 'express';
import { container } from 'tsyringe';
import { AgendamentoController } from '../controllers/AgendamentoController';

const agendamentoRoutes = Router();
const controller = container.resolve(AgendamentoController);

agendamentoRoutes.post('/', controller.create.bind(controller));
agendamentoRoutes.get('/paginated', controller.listPaginated.bind(controller));
agendamentoRoutes.get('/', controller.list.bind(controller));
agendamentoRoutes.put('/:id', controller.update.bind(controller));
agendamentoRoutes.delete('/:id', controller.delete.bind(controller));

export { agendamentoRoutes };
