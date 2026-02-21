// File: lib/Utils/Logger.js
// Module: Chatify Framework

const pino = require('pino');

const logger = pino({
    level: process.env.LOG_LEVEL || 'silent',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard',
            messageFormat: '{msg}'
        }
    }
});

module.exports = logger;