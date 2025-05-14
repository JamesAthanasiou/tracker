import pino from 'pino';
import fs from 'fs';

export const logger = pino({
    level: 'warn',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true, // Enable colors
            translateTime: 'yyyy-mm-dd HH:MM:ss', // Human-readable timestamps
            ignore: 'pid,hostname', // Remove extra fields
        },
    },
});

export const logStream = fs.createWriteStream(
    `./logs/error_${new Date().toJSON().slice(0, 10)}.log`,
    { flags: 'a' }
);
