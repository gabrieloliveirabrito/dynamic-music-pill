import GLib from "@girs/glib-2.0";

export function smartUnpack(object: any) : any {
    if (object === null || object === undefined) {
        return null;
    }

    if (object instanceof GLib.Variant) {
        return object.deepUnpack();
    }

    if (Array.isArray(object)) {
        return object.map(smartUnpack);
    }

    return object;
}