import Gio from "gi://Gio"
import GObject from "gi://GObject"
import GLib from "gi://GLib"

type Widen<T> =
    T extends string ? string :
    T extends number ? number :
    T extends boolean ? boolean :
    T extends GLib.Variant ? GLib.Variant :
    T;

export type SettingsRecord = {
    key: string;
    default: GLib.Variant | string | number | boolean | never;
}

export type SettingsMap = {
    [K: string]: SettingsRecord
}

export type SettingsProperties<TMap extends SettingsMap> = {
    -readonly [K in keyof TMap]: TMap[K] extends { default: infer T } ? Widen<T> : never;
}

export type SchemaKey<T extends SettingsMap> = T[keyof T]["key"];

type RemoveIndexSignature<T> = {
    [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : K]: T[K];
};

export type SettingsSignal<TMap extends SettingsMap> = `changed::${SchemaKey<TMap>}` | keyof RemoveIndexSignature<Gio.Settings.SignalSignatures>;

export type SettingsSignalCallback<TMap extends SettingsMap, TSignal> = TSignal extends `changed::${string}`
    ? (key: string) => void
    : TSignal extends keyof Gio.Settings.SignalSignatures
    ? Gio.Settings.SignalSignatures[TSignal]
    : never;

export type SettingsActions<TMap extends SettingsMap> = {
    bind<K extends keyof TMap>(
        prop: K,
        object: GObject.Object,
        property: string,
        flags?: Gio.SettingsBindFlags,
    ): void;

    connect<K extends keyof Gio.Settings.SignalSignatures>(
        signal: K | `changed::${SchemaKey<TMap>}`,
        callback: Gio.Settings.SignalSignatures[K]
    ): number;
};

export type SettingsGroup<TMap extends SettingsMap> = SettingsProperties<TMap> & SettingsActions<TMap>;


//??
export function createSettingsMap<const T extends SettingsMap>(map: T): T {
    return map;
}

export function createSettingsGroup<TMap extends SettingsMap>(
    settings: Gio.Settings,
    map: TMap,
): SettingsGroup<TMap> {
    const methods: SettingsActions<TMap> = {
        bind<K extends keyof TMap>(
            prop: K,
            object: GObject.Object,
            property: string,
            flags = Gio.SettingsBindFlags.DEFAULT,
        ) {
            settings.bind(
                map[prop].key,
                object,
                property,
                flags,
            );
        },
        connect<K extends keyof Gio.Settings.SignalSignatures>(
            signal: K | `changed::${SchemaKey<TMap>}`,
            callback: Gio.Settings.SignalSignatures[K]
        ): number {
            return settings.connect(signal, callback);
        }
    };

    return new Proxy(methods, {
        get(target, prop) {
            if (prop in target)
                return target[prop as keyof typeof target];

            const entry = map[prop as keyof TMap];
            const type = typeof entry.default;

            switch (type) {
                case "boolean":
                    return settings.get_boolean(entry.key);

                case "number":
                    return settings.get_int(entry.key);

                case "string":
                    return settings.get_string(entry.key);
            }
        },

        set(_, prop, value) {
            const entry = map[prop as keyof TMap];
            const type = typeof entry.default;

            switch (type) {
                case "boolean":
                    settings.set_boolean(entry.key, value);
                    return true;

                case "number":
                    settings.set_int(entry.key, value);
                    return true;

                case "string":
                    settings.set_string(entry.key, value);
                    return true;
            }

            return false;
        },
    }) as SettingsProperties<TMap> & typeof methods;
}