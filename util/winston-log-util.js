const winston = require('winston')
require('winston-daily-rotate-file')
const { combine, timestamp, label, printf } = winston.format
const util = require('util')

const loggingLevels = {
    error: 0,
    warning: 1,
    info: 2
}

const format = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}] [${level}] ${label} - ${message}`
})

const timezoned = () => {
    return new Date().toLocaleString('ja', {
        timeZone: 'Asia/Tokyo'
    });
}

const infoTransport = new winston.transports.DailyRotateFile({
    level: 'info',
    filename: 'logs/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true
})

const errorTransport = new winston.transports.DailyRotateFile({
    level: 'error',
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true
})

const traceTransport = new winston.transports.DailyRotateFile({
    level: 'warning',
    filename: 'logs/trace-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true
})

const infoLogger = winston.createLogger({
    levels: loggingLevels,
    format: combine(
        label({label: 'infolog'}),
        timestamp({format: timezoned}),
        format
    ),
    transports: [
        new winston.transports.Console({level:'info'}),
        infoTransport
    ],
    exitOnError: false
})

const errorLogger = winston.createLogger({
    levels: loggingLevels,
    format: combine(
        label({label: 'errorlog'}),
        timestamp({format: timezoned}),
        format
    ),
    transports: [
        new winston.transports.Console({level:'error'}),
        errorTransport
    ],
    exitOnError: false
})

const traceLogger = winston.createLogger({
    levels: loggingLevels,
    format: combine(
        label({label: 'tracelog'}),
        timestamp({format: timezoned}),
        format
    ),
    transports: [
        new winston.transports.Console({level:'warning'}),
        traceTransport
    ],
    exitOnError: false
})

exports.info = function (...args) {
    infoLogger.info(util.format(...args))
}

exports.error = function (...args) {
    errorLogger.error(util.format(...args))
}

exports.trace = function (...args) {
    traceLogger.warning(util.format(...args))
}
