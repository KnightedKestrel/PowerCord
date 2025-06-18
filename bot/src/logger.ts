const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');
require('dotenv').config();

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

if (process.env.LOGTAIL_SOURCE_TOKEN && process.env.LOGTAIL_INGESTING_HOST) {
    // Create a Logtail client
    const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
        endpoint: `https://${process.env.LOGTAIL_INGESTING_HOST}`,
    });

    // Create a Winston logger - passing in the Logtail transport
    const logtailTransport = winston.createLogger({
        transports: [new LogtailTransport(logtail)],
    });

    logger.add(logtailTransport);
}

export default logger;
