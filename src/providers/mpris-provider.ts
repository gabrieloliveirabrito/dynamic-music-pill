import GIO from "@girs/gio-2.0"
import GLib from "@girs/glib-2.0";
import { IMPrisProvider, MPRISCallback } from "@/interfaces/impris-provider";
import { TrackInfo } from "@/types/track-info";
import { logDebug, logInfo, logObject, logWarning } from "@/utils/log";
import { MTRISConstants } from "@/constants";

export type MTRISMap = {
    [K: string]: (v: any, state: TrackInfo) => void;
}

const mapper: MTRISMap = {
    "PlaybackStatus": (v, state) => state.playbackStatus = v,
    "xesam:title": (v, state) => state.title = v,
    "xesam:artist": (v, state) => state.artist = v,
    "xesam:album": (v, state) => state.album = v,
    "mpris:artUrl": (v, state) => state.artUrl = v,
    "mpris:length": (v, state) => state.length = v,
    "mpris:trackid": (v, state) => state.trackId = v,
    "CanPlay": (v, state) => state.canPlay = v,
    "CanPause": (v, state) => state.canPause = v,
    "CanSeek": (v, state) => state.canSeek = v,
    "CanGoNext": (v, state) => state.canGoNext = v,
    "CanGoPrevious": (v, state) => state.canGoPrevious = v,
};

export function createMPRISProvider(): IMPrisProvider {
    let callbacks = new Map<string, MPRISCallback>();
    let connection: GIO.DBusConnection | null = null;
    let signalId: number | null = null;
    let state: TrackInfo = {}

    function mapState(object: any) {
        for (let [key, value] of Object.entries(object))
        {
            value = value as typeof GLib.Variant ? (value as GLib.Variant).deep_unpack() : value;
            
            if (key === "Metadata" && value && typeof value === "object") {
                mapState(value);
                continue;
            }

            logInfo(`Mapping ${key}`);
            if (mapper[key]) {
                mapper[key](value, state);
                continue;
            } else {
                logWarning(`Cannot find mapper for key ${key}`)
            }
        }
    }

    function signalEmit(conn: GIO.DBusConnection, sender_name: string | null, object_path: string, interface_name: string, signal_name: string, parameters: GLib.Variant) {
        if (!object_path.startsWith(MTRISConstants.MPRIS_OBJECT)) {
            return;
        }

        const unpacked: any[] = parameters.deep_unpack() as any[];
        if (!Array.isArray(unpacked)) {
            return;
        }

        const [iface, changed] = unpacked;
        if (iface != MTRISConstants.MPRIS_INTERFACE) {
            return;
        }
        logObject(changed);

        mapState(changed);
        callbacks.forEach(c => c(state))
    }

    function start() {
        logInfo("Creating DBus connection");
        connection = GIO.DBusConnection.new_for_address_sync(
            'unix:path=/run/user/1000/bus',
            GIO.DBusConnectionFlags.AUTHENTICATION_CLIENT
            | GIO.DBusConnectionFlags.MESSAGE_BUS_CONNECTION,
            null,
            null
        );

        logInfo("Subscribe signal PropertiesChanged")
        signalId = connection.signal_subscribe(
            null,
            "org.freedesktop.DBus.Properties",
            "PropertiesChanged",
            null,
            null,
            GIO.DBusSignalFlags.NONE,
            signalEmit
        )
    }

    function stop() {
        if (connection && signalId !== null) {
            connection.signal_unsubscribe(signalId);
            connection.close_sync(null);
        }

        connection = null;
        signalId = null;
        callbacks.clear();
    }

    function addCallback(name: string, callback: MPRISCallback): void {
        if (callbacks.has(name)) {
            logError(`Callback ${name} already exists!`);
            return;
        }

        callbacks.set(name, callback);
    }

    function removeCallback(name: string): boolean {
        if (!callbacks.has(name)) {
            return false;
        }

        return callbacks.delete(name);
    }

    return { start, stop, addCallback, removeCallback }
}