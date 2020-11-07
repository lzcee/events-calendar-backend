import createServer from './server/server';
import createDbConnection from './database/connection';

try {
	const server = createServer();
	server.start();

	const db = createDbConnection();
	db.start();
} catch (error) {
	console.log(`[App] - Error: ${error}`);
}