import GLib from "gi://GLib";
import { LogConstants } from "@/constants";
import { smartUnpack } from "./packing";

const PREFIX = LogConstants.LOG_PREFIX;

export type LogObjectOptions = {
    trace?: boolean;
    json?: boolean;
    treeLevel: number;
}

export function logInfo(message: string): void {
    console.log(`${PREFIX} [INFO] ${message}`);
}

export function logWarning(message: string): void {
    console.warn(`${PREFIX} [WARNING] ${message}`);
}

export function logDebug(message: string): void {
    console.log(`${PREFIX} [DEBUG] ${message}`);
}

export function logError(message: unknown): void {
    console.error(`${PREFIX} [ERROR] ${message}`);

    if (message instanceof Error) {
        console.error(`${PREFIX} Stack trace: ${message.stack}`);
    }
}

export function logTrace(message: string) {
    console.trace(`${PREFIX} [TRACE] ${message}`);
}

export function logObject(object: any | null | undefined, options: Partial<LogObjectOptions> = { trace: false, json: false, treeLevel: 0 }): void {
    const { trace = false, json = false, treeLevel = 0 } = options;
    const level = "-".repeat(treeLevel);
    const nextLevel = `${level}-`;

    const logFn = trace ? logTrace : logInfo;
    if (object === null) {
        logFn(`${nextLevel} Object is null`);
        return;
    }

    if (object === undefined) {
        logFn(`${nextLevel} Object is undefined`);
        return;
    }

    if (object instanceof GLib.Variant) {
        const unpacked = smartUnpack(object);

        if (json) {
            logFn(`${nextLevel} Variant as JSON: ${JSON.stringify(unpacked)}`);
            return;
        }

        logInfo(`${nextLevel} Variant`);
        logObject(unpacked, { ...options, treeLevel: treeLevel + 1 });
        return;
    }

    if (typeof object === 'string') {
        logFn(`${nextLevel} String ${object}`);
        return;
    }

    if (typeof object === 'number') {
        logFn(`${nextLevel} Number ${object}`);
        return;
    }

    if (typeof object === 'boolean') {
        logFn(`${nextLevel} Boolean ${object}`);
        return;
    }

    if (Array.isArray(object)) {
        logInfo(`${nextLevel} Array`);
        for (const item of object) {
            logObject(item, { ...options, treeLevel: treeLevel + 1 });
        }
        return;
    }

    const variant = object.deep_unpack ? smartUnpack(object) : object;
    if (json) {
        logFn(`${nextLevel} Object as JSON: ${JSON.stringify(variant)}`)
    } else {
        const keys = Object.keys(variant);
        keys.forEach(key => {
            const child = variant[key];
            
            logFn(`${nextLevel} ${key} - ${typeof child}`);
            logObject(child, { ...options, treeLevel: treeLevel + 1 });
        });
    }
}