import Gio from "gi://Gio";
import GObject from "gi://GObject";
import GLib from "gi://GLib";
import { getDBusSessionAddress } from "@/utils/development";
import { smartUnpack } from "@/utils/packing";
import { MPRIS_INTERFACE, MPRIS_OBJECT, PLAYER_INTERFACE } from "@/constants/mpris-constants";
import { logDebug, logInfo, logObject } from "@/utils/log";
import { PlaybackStatus, PlayerState } from "@/types/player-types";

const flags = Gio.DBusConnectionFlags.AUTHENTICATION_CLIENT | Gio.DBusConnectionFlags.MESSAGE_BUS_CONNECTION;

export class DBusProvider extends GObject.Object {
    static {
        GObject.registerClass({
            Signals: {
                "player-added": {
                    param_types: [GObject.TYPE_STRING]
                },
                "player-removed": {
                    param_types: [GObject.TYPE_STRING]
                },
                "player-status-changed": {
                    param_types: [GObject.TYPE_STRING]
                },
                "player-rate-changed": {
                    param_types: [GObject.TYPE_FLOAT]
                }
            }
        },this);
    }

    private _address : string = getDBusSessionAddress();
    private _connection : Gio.DBusConnection | null = null;
    private _propertiesChangedSignal : number | null = null;

    constructor() {
        super();
    }

    start() {
        logDebug(`Creating DBus connection for address: ${this._address}`);

        this._connection = Gio.DBusConnection.new_for_address_sync(this._address, flags, null, null);
        this._propertiesChangedSignal = this._connection.signal_subscribe(
            null,
            MPRIS_INTERFACE,
            "PropertiesChanged",
            null,
            null,
            Gio.DBusSignalFlags.NONE,
            this._propertiesChanged.bind(this)
        );
    }

    stop() {
        if (this._connection === null) {
            return;
        }

        if (this._propertiesChangedSignal !== null) {
            this._connection.signal_unsubscribe(this._propertiesChangedSignal);
        }

        this._connection.close_sync(null);
        this._connection = null;
        this._propertiesChangedSignal = null;
    }

    listPlayers() : string[] {
        if (this._connection === null) {
            return [];
        }

        const result = this._connection.call_sync(
            'org.freedesktop.DBus',
            '/org/freedesktop/DBus',
            'org.freedesktop.DBus',
            'ListNames',
            null, null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        );

        const names = smartUnpack(result)[0];
        return names.filter((name: string) => name.startsWith(`${PLAYER_INTERFACE}.`));
    }

    private _propertiesChanged(connection: Gio.DBusConnection, sender_name: string | null, object_path: string, interface_name: string, signal_name: string, parameters: GLib.Variant) {
        if (!object_path.startsWith(MPRIS_OBJECT)) {
            return;
        }

        logDebug(`PropertiesChanged: ${sender_name} ${object_path} ${interface_name} ${signal_name}`);
        logObject(parameters);

        const unpacked: any[] = smartUnpack(parameters);
        if(!Array.isArray(unpacked) || unpacked.length < 2) {
            return;
        }

        const [iface, changed] = unpacked;
        if (iface != MPRIS_INTERFACE) {
            return;
        }

        if (changed["PlaybackStatus"]) {
            this.emit("player-status-changed", changed["PlaybackStatus"]);
        }

        if (changed["Rate"]) {
            this.emit("player-rate-changed", changed["Rate"]);
        }
    }
}

// export type PlaybackStatusCallback = (status: PlaybackStatus, rate: number) => void;
// export type PlayerStateCallback = (state: PlayerState) => void;

// export interface DBusProvider {
//     init(): void;
//     listNames(): string[];
//     destroy(): void;
//     addPlaybackStatusCallback(callback: PlaybackStatusCallback): void;
//     addPlayerStateCallback(callback: PlayerStateCallback): void;
// }


// export function createDBusProvider(): DBusProvider {
//     const address = getDBusSessionAddress();
//     logDebug(`Creating DBus connection for address: ${address}`);

//     let connection: Gio.DBusConnection | null = null;
//     let propertiesChangedSignal: number | null = null;
//     let playbackStatusCallbacks: PlaybackStatusCallback[] = [];
//     let playerStateCallbacks: PlayerStateCallback[] = [];

//     function propertiesChanged(connection: Gio.DBusConnection, sender_name: string | null, object_path: string, interface_name: string, signal_name: string, parameters: GLib.Variant) {
//         if (!object_path.startsWith(MPRIS_OBJECT)) {
//             return;
//         }

//         logDebug(`PropertiesChanged: ${sender_name} ${object_path} ${interface_name} ${signal_name}`);
//         logObject(parameters);

//         const unpacked: any[] = smartUnpack(parameters);
//         if(!Array.isArray(unpacked) || unpacked.length < 2) {
//             return;
//         }

//         const [iface, changed] = unpacked;
//         if (iface != MPRIS_INTERFACE) {
//             return;
//         }

//         if (changed["PlaybackStatus"]) {
//             playbackStatusCallbacks.forEach(c => c(changed["PlaybackStatus"], changed["Rate"] || 0));
//         }

//         logObject(changed);
//     }

//     function init() {
//         logDebug("Initializing DBus connection");

//         connection = Gio.DBusConnection.new_for_address_sync(address, flags, null, null);
//         propertiesChangedSignal = connection.signal_subscribe(
//             null, 
//             MPRIS_INTERFACE,
//             "PropertiesChanged",
//             null,
//             null,
//             Gio.DBusSignalFlags.NONE,
//             propertiesChanged
//         );
//     }

//     function addPlaybackStatusCallback(callback: PlaybackStatusCallback) {
//         playbackStatusCallbacks.push(callback);
//     }
    
//     function addPlayerStateCallback(callback: PlayerStateCallback) {
//         playerStateCallbacks.push(callback);
//     }

//     function listNames() {
//         if (connection === null) {
//             return [];
//         }

//         const result = connection.call_sync(
//             'org.freedesktop.DBus',
//             '/org/freedesktop/DBus',
//             'org.freedesktop.DBus',
//             'ListNames',
//             null, null,
//             Gio.DBusCallFlags.NONE,
//             -1,
//             null
//         );

//         const names = smartUnpack(result)[0];
//         logInfo(`Names: ${names.filter((name: string) => name.startsWith(`${PLAYER_INTERFACE}`)).join(", ")}`);

//         return names.filter((name: string) => name.startsWith(`${PLAYER_INTERFACE}.`));
//     }

//     function destroy() {
//         if (connection === null) {
//             return;
//         }

//         if (propertiesChangedSignal !== null) {
//             connection.signal_unsubscribe(propertiesChangedSignal);
//         }

//         connection.close_sync(null);
//         playbackStatusCallbacks = [];
//         playerStateCallbacks = [];
//     }

//     return { init, listNames, destroy, addPlaybackStatusCallback, addPlayerStateCallback};
// }