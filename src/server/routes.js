import { Router } from 'express';
import createUserController from '../controllers/user.controller';

const routes = Router();

const userController = createUserController();

routes.post('/users', userController.createUser);

export default routes;