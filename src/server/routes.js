import { Router } from 'express';
import cors from 'cors';
import createAuth from '../services/auth.service';
import createUserController from '../controllers/user.controller';
import createEventController from '../controllers/event.controller';

const routes = Router();
const auth = createAuth();

const userController = createUserController();
const eventController = createEventController();

routes.use(cors());

routes.post('/users', userController.createUser);
routes.get('/users', userController.findUser);

routes.post('/events', auth.authorize, eventController.createEvent);
routes.delete('/events/:id', auth.authorize, eventController.deleteEvent);
routes.put('/events/:id', auth.authorize, eventController.updateEvent);
routes.get('/events', auth.authorize, eventController.findEvent);

export default routes;