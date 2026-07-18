import { logDebug, logInfo, logObject } from "./log";
import { smartUnpack } from "./packing";

export type MapperCallback<S> = (state: S, value: any) => void;
export type MapperType<S> = Record<string, MapperCallback<S>>

export function invokeMapper<M>(mapper: MapperType<M>, key: string, value: any, parent: M): void {
    const map = mapper[key];

    if (map) {
        map(parent, value);
    }
}

export function mapObject<M>(object: any, mapper: MapperType<M>, parent: M = {} as M): M {
    for (let [key, value] of Object.entries(object)) {
        value = smartUnpack(value);

        if (!value) {
            continue;
        }

        if (typeof value === "object" && !Array.isArray(value)) {
            mapObject(value, mapper, parent);
            continue;
        }

        invokeMapper(mapper, key, value, parent);
    }

    return parent;
}

export function checkChanged<T extends object>(oldValue: T | undefined, newValue: T | undefined, debug: boolean = false, tree: string[] = []): [boolean, [string, any, any]] {
    if (oldValue === undefined && newValue !== undefined) {
        if (debug) {
            logDebug(`Changed: ${tree.join(" -> ")} is undefined -> defined`);
        }

        return [true, [tree.join(" -> "), oldValue, newValue]];
    }

    if (oldValue !== undefined && newValue === undefined) {
        if (debug) {
            logDebug(`Changed: ${tree.join(" -> ")} is defined -> undefined`);
        }

        return [true, [tree.join(" -> "), oldValue, newValue]];
    }

    for (let [key, value] of Object.entries(oldValue!)) {
        const compareValue = newValue![key as keyof T];

        const newTree = tree.concat([key]);
        const newTreeString = newTree.join(" -> ");

        if (debug) {
            logDebug(`Comparing: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
        }

        if (value === null && compareValue !== null) {
            if (debug) {
                logDebug(`Changed: ${newTreeString} value is null -> compareValue is not null`);
            }
            return [true, [newTreeString, value, compareValue]];
        }

        if (value !== null && compareValue === null) {
            if (debug) {
                logDebug(`Changed: ${newTreeString} value is not null -> compareValue is null`);
            }
            return [true, [newTreeString, value, compareValue]];
        }

        if (!Array.isArray(value)) {
            if (typeof value === "object") {
                const [changed, [objectPath, oldCheckValue, newCheckValue]] = checkChanged(value, compareValue, debug, newTree);
                if (changed) {
                    if (debug) {
                        logDebug(`Changed: ${objectPath} ${typeof oldCheckValue} -> ${typeof newCheckValue}`);
                    }
                    return [true, [objectPath, oldCheckValue, newCheckValue]];
                } else {
                    if (debug) {
                        logDebug(`Not changed: ${objectPath} ${typeof oldCheckValue} -> ${typeof newCheckValue}`);
                    }
                    return [false, [objectPath, oldCheckValue, newCheckValue]];
                }
            }

            if (compareValue !== value) {
                if (debug) {
                    logDebug(`Changed: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
                }
                return [true, [newTreeString, value, compareValue]];
            }
        }
        else {
            if (!Array.isArray(compareValue)) {
                if (debug) {
                    logDebug(`Changed: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
                }
                return [true, [newTreeString, value, compareValue]];
            }

            if (debug) {
                logDebug(`Comparing object array: ${newTreeString} ${typeof value} -> ${typeof compareValue}`);
            }

            return checkArrayChanged(value, compareValue, newTree, debug);
        }
    }

    if (Array.isArray(oldValue)) {
        if (!Array.isArray(newValue)) {
            if (debug) {
                logDebug(`Changed: ${tree.join(" -> ")} is array -> not array`);
            }
            return [true, [tree.join(" -> "), oldValue, newValue]];
        }

        if (debug) {
            logDebug(`Comparing array: ${tree.join(" -> ")} is array -> array`);
        }

        return checkArrayChanged(oldValue, newValue, tree, debug);
    }

    return [false, ["", undefined, undefined]];
}

export function checkArrayChanged<T>(oldValue: T[], newValue: T[], tree: string[], debug: boolean = false): [boolean, [string, any, any]] {
    if (debug) {
        logDebug(`Comparing array: ${tree.join(" -> ")} is array -> array`);
    }

    if (newValue.length != oldValue.length) {
        if (debug) {
            logDebug(`Changed: ${tree.join(" -> ")} size is different`);
        }
        return [true, [tree.join(" -> "), oldValue, newValue]];
    }

    for (let i = 0; i < newValue.length; i++) {
        const compareValue = newValue[i];
        const value = oldValue[i];

        if (compareValue === undefined && value !== undefined) {
            if (debug) {
                logDebug(`Changed: ${tree.join(" -> ")}${i} is defined -> undefined`);
            }
            return [true, [tree.join(" -> "), oldValue, newValue]];
        }

        if (compareValue !== undefined && value === undefined) {
            if (debug) {
                logDebug(`Changed: ${tree.join(" -> ")}${i} is undefined -> defined`);
            }
            return [true, [tree.join(" -> "), oldValue, newValue]];
        }
        
        if (debug) {
            logDebug(`Comparing: ${tree.join(" -> ")}${i} ${typeof value} -> ${typeof compareValue}`);
        }

        if (!Array.isArray(value)) {
            if (Array.isArray(compareValue) ) {
                if (debug) {
                    logDebug(`Changed: ${tree.join(" -> ")}${i} is array -> not array`);
                }
                return [true, [tree.join(" -> "), oldValue, newValue]];
            }
        }

        if (compareValue !== value) {
            if (debug) {
                logDebug(`Changed: ${tree.join(" -> ")}${i} is different`);
            }
            return [true, [tree.join(" -> "), oldValue, newValue]];
        }
    }

    return [false, ["", undefined, undefined]];
}