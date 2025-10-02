import winston, { createLogger, format, transports } from "winston";
import { envs } from "../../core/config/env";

export default class Logger {
  private logger: winston.Logger;
  private location?: string;
  private node_env = envs.NODE_ENV;


  constructor(location?: string) {
    this.location = location;
    
    const loggerTransports = [new transports.Console()];
    const loggerFormat = [];
    
    // Add file transports in production
    if (this.node_env === 'production') {
      loggerTransports.push(
        //@ts-ignore
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ 
          filename: 'logs/combined.log' 
        })
      );
    } else {
      loggerFormat.push(format.colorize());
    }

    loggerFormat.push(
      format.timestamp(),
      format.printf(({ timestamp, level, message, ...meta }) => {
        const locationPart = this.location ? `[${this.location}]` : '';
        const metaPart = Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : '';
        return [
          `[${level}]`,
          locationPart,
          `[${timestamp}]:`,
          `${message}`,
          metaPart
        ].filter(part => part !== '').join(' ').trim();
      }),
    )
    
    this.logger = createLogger({
      transports: loggerTransports,
      format: format.combine(...loggerFormat),
    });
  }

  public info(message: string, meta?: any) {
    this.logger.info(message, meta)
  }
  public warn(message: string, meta?: any) {
    this.logger.warn(message, meta)
  }
  public error(message: string, meta?: any) {
    this.logger.error(message, meta)
  }
}