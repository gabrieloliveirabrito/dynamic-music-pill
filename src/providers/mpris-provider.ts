// import GIO from "@girs/gio-2.0"
// import GLib from "@girs/glib-2.0";
// import { IMPrisProvider, MPRISCallback } from "@/interfaces/impris-provider";
// import { PlayerState, TrackInfo } from "@/types/player-types";
// import { logDebug, logInfo, logObject, logWarning } from "@/utils/log";
// import { MPRISConstants } from "@/constants";
// import { mapObject, MapperType } from "@/utils/mapper";
// import { getDBusSessionAddress } from "@/utils/development";
// import { DBusProvider } from "./dbus-provider";

// const MTRISMap: MapperType<MPRISState> = {
//     "PlaybackStatus": (s, v) => s.playerState.playbackStatus = v,
//     "CanPlay": (s, v) => s.playerState.canPlay = v,
//     "CanPause": (s, v) => s.playerState.canPause = v,
//     "CanSeek": (s, v) => s.playerState.canSeek = v,
//     "CanGoNext": (s, v) => s.playerState.canGoNext = v,
//     "CanGoPrevious": (s, v) => s.playerState.canGoPrevious = v,
//     "Rate": (s, v) => s.playerState.rate = v,
//     "xesam:title": (s, v) => s.trackInfo.title = v,
//     "xesam:artist": (s, v) => s.trackInfo.artist = v,
//     "xesam:album": (s, v) => s.trackInfo.album = v,
//     "mpris:artUrl": (s, v) => s.trackInfo.artUrl = v,
//     "mpris:length": (s, v) => s.trackInfo.length = v,
//     "mpris:trackid": (s, v) => s.trackInfo.trackId = v,
// }

// interface MPRISState {
//     trackInfo: TrackInfo;
//     playerState: PlayerState;
// }

// export function createMPRISProvider(dbus: DBusProvider): IMPrisProvider {
//     const _state: MPRISState = {
//         playerState: {
//             playbackStatus: "Stopped",
//             canPlay: false,
//             canPause: false,
//             canSeek: false,
//             canGoNext: false,
//             canGoPrevious: false,
//             rate: 1.0,
//         },
//         trackInfo: {
//             length: 0,
//         },
//     }    

//     let callbacks = new Map<string, MPRISCallback>();
//     let connection: GIO.DBusConnection | null = null;
//     let signalId: number | null = null;

//     function signalEmit(conn: GIO.DBusConnection, sender_name: string | null, object_path: string, interface_name: string, signal_name: string, parameters: GLib.Variant) {
//         if (!object_path.startsWith(MPRISConstants.MPRIS_OBJECT)) {
//             return;
//         }

//         const unpacked: any[] = parameters.deep_unpack() as any[];
//         if (!Array.isArray(unpacked)) {
//             return;
//         }

//         const [iface, changed] = unpacked;
//         if (iface != MPRISConstants.MPRIS_INTERFACE) {
//             return;
//         }
//         logObject(changed);

//         //state = mapObject(changed, MTRISMap, state);
//         //callbacks.forEach(c => c(state))
//     }

//     function start() {
//         dbus.addPlaybackStatusCallback((status, rate) => {
//             _state.playerState.playbackStatus = status;
//             _state.playerState.rate = rate;
//         });
        
//         dbus.addPlayerStateCallback((state) => {
//             _state.playerState = state;
//         });
//     }

//     function stop() {
//         if (connection && signalId !== null) {
//             connection.signal_unsubscribe(signalId);
//             connection.close_sync(null);
//         }

//         connection = null;
//         signalId = null;
//         callbacks.clear();
//     }

//     function addCallback(name: string, callback: MPRISCallback): void {
//         if (callbacks.has(name)) {
//             logError(`Callback ${name} already exists!`);
//             return;
//         }

//         callbacks.set(name, callback);
//     }

//     function removeCallback(name: string): boolean {
//         if (!callbacks.has(name)) {
//             return false;
//         }

//         return callbacks.delete(name);
//     }

//     return { start, stop, addCallback, removeCallback }
// }