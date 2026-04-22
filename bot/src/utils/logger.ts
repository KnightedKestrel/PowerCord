import { createLogger, format, transports } from 'winston';
import { consoleFormat } from 'winston-console-format';

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

export default logger;
