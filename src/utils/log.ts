const PREFIX = "[DMP]";

export function logInfo(message: string): void {
    console.log(`${PREFIX} ${message}`);
}

export function logWarning(message: string): void {
    console.warn(`${PREFIX} ${message}`);
}

export function logDebug(message: string): void {
    console.log(`${PREFIX} [DEBUG] ${message}`);
}

export function logError(message: unknown): void {
    console.error(`${PREFIX} ${message}`);

    if (message instanceof Error) {
        console.error(`${PREFIX} Stack trace: ${message.stack}`);
    }
}