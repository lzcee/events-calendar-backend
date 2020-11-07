import { Router } from 'express';
import createAuth from '../services/auth.service';
import createUserController from '../controllers/user.controller';
import createEventController from '../controllers/event.controller';

const routes = Router();
const auth = createAuth();

const userController = createUserController();
const eventController = createEventController();

routes.post('/users', userController.createUser);
routes.get('/users/:id', auth.authorize, userController.findUser);

routes.post('/events', auth.authorize, eventController.createEvent);

export default routes;