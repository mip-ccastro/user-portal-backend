import { Client } from 'pg';
import { Logger } from '../../utils/helper';
import { envs } from './env';

const DB_NAME: string = envs.DB_NAME;
const DB_USERNAME: string = envs.DB_USERNAME || '';
const DB_HOST: string = envs.DB_HOST;
const DB_PASSWORD: string = envs.DB_PASSWORD || '';
const DB_PORT: number = envs.DB_PORT;

const logger = new Logger('DB Initializer');

const initializeDB = async (): Promise<void> => {

    const is_dev = (envs.NODE_ENV || 'development')  === 'development';

    logger.info(`NODE_ENV: ${envs.NODE_ENV}`);
    logger.info(`DB_NAME: ${DB_NAME}`);

    if (!is_dev) return logger.info(`IN ${(envs.NODE_ENV).toUpperCase()} ENVIRONMENT - SKIPPING DATABASE CREATION.`);

    const client = new Client({
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        port: DB_PORT,
    });

    try {
        await client.connect();
    
        const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`);

        if (res.rowCount === 0) {
            logger.info(`${DB_NAME} database not found.`);
            logger.info(`Creating database ${DB_NAME}...`);
            await client.query(`CREATE DATABASE "${DB_NAME}";`);
            logger.info(`Created database ${DB_NAME}.`);
        } else {
            logger.info(`${DB_NAME} database already exists.`);
        }
    } catch (error) {
        logger.error(`Error initializing database:`, error as any);
    } finally {
        await client.end();
    }
}

export default initializeDB;