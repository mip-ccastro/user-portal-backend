import initializeDB from './core/config/db-intialize';
import { envs } from './core/config/env';
import { Server } from './server';
import AppDataSource from './core/config/data-source';
import { Logger }from './utils/helper';


const logger = new Logger('root');

const main = async (): Promise<void> => {
	logger.info('Starting application...');
	await initializeDB();

	const server = new Server({
		port: envs.PORT
	});

	AppDataSource.initialize().then(async () => {
		void server.start();
	})
	.catch(error => logger.error('Error during Data Source initialization:', error));
}

main()