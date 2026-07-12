import { TrackInfo } from "@/types/player-types"
import { logDebug, logInfo } from "./log";
import { smartUnpack } from "./packing";

export type MapperCallback<S> = (state: S, value: any) => void;
export type MapperType<S> = Record<string, MapperCallback<S>>

export function invokeMapper<M>(mapper: MapperType<M>, key: string, value: any, parent: M): void {
    logInfo(`Mapping ${key}`);
    const map = mapper[key];

    if (map) {
        map(parent, value);
    } else {
        logDebug(`Map for key ${key} to type ${typeof parent} hasn't been found!`);
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