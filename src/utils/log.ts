import { LogConstants } from "@/constants";

const PREFIX = LogConstants.LOG_PREFIX;

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

export function logTrace(message: string) {
    console.trace(`${PREFIX} ${message}`);
}

export function logObject(object: any | null | undefined): void {
    if (object === null) {
        logTrace("Object is null");
        return;
    }

    if (object === undefined) {
        logTrace("Object is undefined");
        return;
    }

    let inspected = JSON.stringify(object, (key, value) => {
        if (value && value.deep_unpack) {
            return value.deep_unpack();
        }

        return value;
    })
    logInfo(`Inspecting object ${inspected}`);
}