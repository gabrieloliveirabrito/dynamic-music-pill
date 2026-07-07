import { logError } from "./log";

export function safeCall<T extends (...args: any[]) => any>(fn: T, ...args: Parameters<T>): ReturnType<T> | undefined {
    try {
        return fn(...args);
    } catch (error) {
        logError(error);
        return undefined;
    }
}