export function logInfo(message: string): void {
    console.info(`[DMP] ${message}`);
}

export function logWarning(message: string): void {
    console.warn(`[DMP] ${message}`);
}

export function logDebug(message: string): void {
    console.debug(`[DMP] ${message}`);
}

export function logError(message: unknown): void {
    console.error(`[DMP] ${message}`);

    if (message instanceof Error) {
        console.error(`[DMP] Stack trace: ${message.stack}`);
    }
}