import GIO from "@girs/gio-2.0"
import GLib from "@girs/glib-2.0";
import { IMPrisProvider, MPRISCallback } from "@/interfaces/impris-provider";
import { TrackInfo } from "@/types/track-info";
import { logDebug, logInfo, logObject, logWarning } from "@/utils/log";
import { MTRISConstants } from "@/constants";
import { mapObject, MapperType } from "@/utils/mapper";
import { getDBusSessionAddress } from "@/utils/development";
import { DefaultTrackInfo } from "@/constants/mpris-constants";

const MTRISMap: MapperType<TrackInfo> = {
    "PlaybackStatus": (s, v) => s.playbackStatus = v,
    "xesam:title": (s, v) => s.title = v,
    "xesam:artist": (s, v) => s.artist = v,
    "xesam:album": (s, v) => s.album = v,
    "mpris:artUrl": (s, v) => s.artUrl = v,
    "mpris:length": (s, v) => s.length = v,
    "mpris:trackid": (s, v) => s.trackId = v,
    "CanPlay": (s, v) => s.canPlay = v,
    "CanPause": (s, v) => s.canPause = v,
    "CanSeek": (s, v) => s.canSeek = v,
    "CanGoNext": (s, v) => s.canGoNext = v,
    "CanGoPrevious": (s, v) => s.canGoPrevious = v,
    "Rate": (s, v) => s.rate = v
}

export function createMPRISProvider(): IMPrisProvider {
    const address = getDBusSessionAddress();
    

    let callbacks = new Map<string, MPRISCallback>();
    let connection: GIO.DBusConnection | null = null;
    let signalId: number | null = null;
    let state: TrackInfo = { ...DefaultTrackInfo }

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

        state = mapObject(changed, MTRISMap, state);
        callbacks.forEach(c => c(state))
    }

    function start() {
        logInfo("Creating DBus connection");
        connection = GIO.DBusConnection.new_for_address_sync(
            address,
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