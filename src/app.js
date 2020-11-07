import createServer from './server/server';

try {
	const server = createServer();
	server.start();
} catch (error) {
	console.log(`[App] - Error: ${error}`);
}