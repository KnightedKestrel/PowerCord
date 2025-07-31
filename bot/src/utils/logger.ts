import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';
import { createLogger, format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';
import { config } from './config';

const consoleTransport = new transports.Console({
    format: format.combine(
        format.colorize({ all: true }),
        format.padLevels(),
        consoleFormat({
            showMeta: true,
            metaStrip: ['timestamp', 'service'],
            inspectOptions: {
                depth: Infinity,
                colors: true,
                maxArrayLength: Infinity,
                breakLength: 120,
                compact: Infinity,
            },
        }),
    ),
});

const logger = createLogger({
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json(),
    ),
    transports: [consoleTransport],
    exceptionHandlers: [consoleTransport],
});

if (config.LOGTAIL_SOURCE_TOKEN && config.LOGTAIL_INGESTING_HOST) {
    const logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN, {
        endpoint: `https://${config.LOGTAIL_INGESTING_HOST}`,
    });

    const logtailTransport = createLogger({
        transports: [new LogtailTransport(logtail)],
    });

    logger.add(logtailTransport);
}

export default logger;
