import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
	console.log('Verb: Get -- Path: /');
	res.json({ 'message': 'ok' });
});

export default routes;