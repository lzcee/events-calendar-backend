import express from 'express';
import routes from './routes';

const createServer = () => {
	const server = express();
	const port = 3333;

	server.use(express.json());
	server.use(routes);

	const start = () => {
		server.listen(port, () => {
			console.log(`[Server] - Listen on port ${port}`);
		});
	}

	return {
		start
	}
}

export default createServer;