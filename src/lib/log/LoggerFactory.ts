

export interface Logger {
    info();
    warn();
    error();
}

export class LoggerFactory {
    getLogger(): Logger {
        return null;
    }
}