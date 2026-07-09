import GLib from "gi://GLib";
import { LogConstants } from "@/constants";
import { smartUnpack } from "./packing";

const PREFIX = LogConstants.LOG_PREFIX;

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

export function logObject(object: any | null | undefined, level: string = ""): void {
    const nextLevel = `${level}-`;
    if (object === null) {
        logTrace("Object is null");
        return;
    }

    if (object === undefined) {
        logTrace("Object is undefined");
        return;
    }

    if (object instanceof GLib.Variant) {
        logObject(smartUnpack(object), nextLevel);
        return;
    }

    if (typeof object === 'string') {
        logTrace(`${level} String ${object}`);
        return;
    }

    if (typeof object === 'number') {
        logTrace(`${level} Number ${object}`);
        return;
    }

    if (typeof object === 'boolean') {
        logTrace(`${level} Boolean ${object}`);
        return;
    }

    if (Array.isArray(object)) {
        for (const item of object) {
            logObject(item, nextLevel);
        }
        return;
    }
    
    const variant = object.deep_unpack ? smartUnpack(object) : object;    
    const keys = Object.keys(variant);
    keys.forEach(key => {
        logTrace(`${nextLevel}${key} = ${smartUnpack(variant[key])}`);
    });
}