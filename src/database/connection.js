import { createConnection } from 'typeorm';

const createDbConnection = () => {
	const start = () => {
		try {
			createConnection();
			console.log('[Database] - Database connected');
		} catch (error) {
			console.log(`[Database] - ${error}`);
		}
	}

	return {
		start
	}
}

export default createDbConnection;