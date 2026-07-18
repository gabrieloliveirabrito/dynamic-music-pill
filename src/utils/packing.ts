import GLib from "@girs/glib-2.0";

export function smartUnpack(object: any) : any {
    if (object === null || object === undefined) {
        return null;
    }

    if (object instanceof GLib.Variant || typeof object === 'object') {
        let unpacked : any = object.deepUnpack ? object.deepUnpack() : object;
        if (!unpacked) {
            return unpacked;
        }

        if (Array.isArray(unpacked)) {
            return unpacked.map(smartUnpack);
        }

        const entries = Object.entries(unpacked);
        if (entries.length === 0) {
            return unpacked;
        }

        for (const [key, value] of entries) {
            if (value instanceof GLib.Variant) {
                unpacked[key] = smartUnpack(value);
            }
        }

        return unpacked;
    }

    return object;
}