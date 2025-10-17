import { envs } from './core/config/env';
import { Logger }from './utils/helper';
import { Server } from './server';
import AppDataSource from './core/config/data-source';
import AzureEmailService from './utils/email/MicrosoftEmailService';
import initializeDB from './core/config/db-intialize';


const logger = new Logger('root');
export let mailSender: AzureEmailService;

const main = async (): Promise<void> => {
	logger.info('Starting application...');
	await initializeDB();

	const server = new Server({
		port: envs.PORT
	});

	AppDataSource.initialize().then(async () => {
		void server.start();

		mailSender = server.getEmailService();
	})
	.catch(error => logger.error('Error during Data Source initialization:', error));
}

main()