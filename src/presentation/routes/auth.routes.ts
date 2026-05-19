import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const controller = container.resolve(AuthController);

authRoutes.post('/register', controller.register.bind(controller));
authRoutes.post('/login', controller.login.bind(controller));

export { authRoutes };
