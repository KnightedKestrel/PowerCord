import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { createLogger, format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';

require('dotenv').config();

const logger = createLogger({
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json(),
    ),
});

if (process.env.LOGTAIL_SOURCE_TOKEN && process.env.LOGTAIL_INGESTING_HOST) {
    // Create a Logtail client
    const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
        endpoint: `https://${process.env.LOGTAIL_INGESTING_HOST}`,
    });

    // Create a Winston logger - passing in the Logtail transport
    const logtailTransport = createLogger({
        transports: [new LogtailTransport(logtail)],
    });

    logger.add(logtailTransport);
}

export default logger;
