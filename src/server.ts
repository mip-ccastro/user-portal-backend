import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors'

import { CUSTOM_HEADERS, HttpCode, ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants';
import { Logger } from './utils/helper';
import routes from './routes';

interface ServerOptions {
	port: number;
	apiPrefix?: string;
}

export class Server {
	private readonly app = express();
	private readonly port: number;
	private logger: Logger;

	constructor(options: ServerOptions) {
		const { port } = options;
		this.port = port;
		this.logger = new Logger('Server');
	}

	async start(): Promise<void> {
		//* Middlewares
		this.app.use(express.json()); // parse json in request body (allow raw)
		this.app.use(express.urlencoded({ extended: true })); // allow x-www-form-urlencoded
		this.app.use(compression());
		this.app.use(cors({
			credentials: true,
			origin: true,
			exposedHeaders: CUSTOM_HEADERS
		}));

		//  limit repeated requests to public APIs
		// this.app.use(
		// 	rateLimit({
		// 		max: ONE_HUNDRED,
		// 		windowMs: SIXTY * SIXTY * ONE_THOUSAND,
		// 		message: 'Too many requests from this IP, please try again in one hour'
		// 	})
		// );

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			this.logger.info(`${req.method} ${req.url}`);
			next()
		})

		// Test rest api
		this.app.get('/', (_req: Request, res: Response) => {
			res.status(HttpCode.OK).send({
				message: `Api is running! \n Endpoints available at http://localhost:${this.port}/`
			});
		});

		// routes
		this.app.use(routes)

		// 404 handler
		this.app.use((req: Request, res: Response) => {
			this.logger.error(`404 Not Found: ${req.method} ${req.url}`);
			res.status(HttpCode.NOT_FOUND).send({
				message: 'Not Found',
				error: 'Not Found'
			});
		});

		// Error handler
		this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
			this.logger.error(`Internal Server Error: METHOD[${req.method}] URL[${req.url}]`, err);
			res.status(HttpCode.INTERNAL_SERVER_ERROR).send({
				message: 'Internal Server Error',
				error: 'Internal Server Error'
			});
		});

		this.app.listen(this.port, () => {
			this.logger.info(`Server is running on port ${this.port}`);
		});
	}
}
