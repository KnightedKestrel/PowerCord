const winston = require('winston');
const { Loggly } = require('winston-loggly-bulk');

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((log: { level: any; message: any }) => {
            return `[${getTimestamp()}][${log.level}] ${log.message}`;
        }),
    ),
    transports: [new winston.transports.Console()],
    exceptionHandlers: [new winston.transports.Console()],
});

if (process.env.LOGGLY_TOKEN && process.env.LOGGLY_SUBDOMAIN) {
    winston.add(
        new Loggly({
            token: process.env.LOGGLY_TOKEN,
            subdomain: process.env.LOGGLY_SUBDOMAIN,
            tags: ['Winston-NodeJS'],
            json: true,
        }),
    );
}

function getTimestamp() {
    let today = new Date();
    let DD: string | number = today.getDate();
    let MM: string | number = today.getMonth() + 1;
    const YYYY: string | number = today.getFullYear();
    let HH: string | number = today.getHours();
    let mm: string | number = today.getMinutes();
    let ss: string | number = today.getSeconds();
    if (DD < 10) DD = `0${DD}`;
    if (MM < 10) MM = `0${MM}`;
    if (HH < 10) HH = `0${HH}`;
    if (mm < 10) mm = `0${mm}`;
    if (ss < 10) ss = `0${ss}`;
    return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
}

export default logger;
