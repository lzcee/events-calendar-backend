import { Router } from 'express';
import createAuth from '../services/auth.service';
import createUserController from '../controllers/user.controller';

const routes = Router();
const auth = createAuth();

const userController = createUserController();

routes.post('/users', userController.createUser);
routes.get('/users/:id', auth.authorize, userController.findUser);

export default routes;