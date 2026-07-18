import Gio from "gi://Gio";
import GObject from "gi://GObject";
import GLib from "gi://GLib";
import { getDBusSessionAddress } from "@/utils/development";
import { smartUnpack } from "@/utils/packing";
import { MPRIS_INTERFACE, MPRIS_OBJECT, PLAYER_INTERFACE } from "@/constants/mpris-constants";
import { logDebug, logInfo, logObject } from "@/utils/log";
import { MediaPlayer } from "./media-player";

const flags = Gio.DBusConnectionFlags.AUTHENTICATION_CLIENT | Gio.DBusConnectionFlags.MESSAGE_BUS_CONNECTION;

export class MPRISProvider extends GObject.Object {
    static {
        GObject.registerClass({
            Signals: {
                "player-added": {
                    param_types: [GObject.TYPE_STRING, GObject.TYPE_OBJECT]
                },
                "player-removed": {
                    param_types: [GObject.TYPE_STRING, GObject.TYPE_OBJECT]
                },
                "player-status-changed": {
                    param_types: [GObject.TYPE_STRING, GObject.TYPE_STRING]
                },
                "player-rate-changed": {
                    param_types: [GObject.TYPE_STRING, GObject.TYPE_FLOAT]
                },
                "player-state-changed": {
                    param_types: [GObject.TYPE_STRING, GObject.TYPE_OBJECT],
                },
                "player-track-changed": {
                    param_types: [GObject.TYPE_STRING, GObject.TYPE_OBJECT],
                },
                "player-volume-changed": {
                    param_types: [GObject.TYPE_STRING, GObject.TYPE_FLOAT],
                },
            }
        },this);
    }

    private _address : string = getDBusSessionAddress();
    private _connection : Gio.DBusConnection | null = null;
    private _nameOwnerChangedSignal : number | null = null;
    private _players : Map<string, MediaPlayer> = new Map();

    constructor() {
        super();
    }

    start() {
        logDebug(`Creating DBus connection for address: ${this._address}`);

        this._connection = Gio.DBusConnection.new_for_address_sync(this._address, flags, null, null);

        this._nameOwnerChangedSignal = this._connection.signal_subscribe(
            "org.freedesktop.DBus",
            "org.freedesktop.DBus",
            "NameOwnerChanged",
            "/org/freedesktop/DBus",
            null, 
            Gio.DBusSignalFlags.NONE, 
            this._nameOwnerChanged.bind(this)
        );

        const names = this.listPlayers();
        for (const name of names) {
            const owner = this.getPlayerOwner(name);
            if (!owner) {
                continue;
            }

            const player = new MediaPlayer(name, owner, this);
            this._players.set(owner, player);
        }
    }

    stop() {
        if (this._connection === null) {
            return;
        }

        for (const player of this._players.values()) {
            player.removePlayer();
        }
        this._players.clear();

        logDebug("Stopping DBus connection");
        if (this._nameOwnerChangedSignal !== null) {
            this._connection.signal_unsubscribe(this._nameOwnerChangedSignal);
            this._nameOwnerChangedSignal = null;
        }

        this._connection.close_sync(null);
        this._connection = null;
    }

    getConnection() : Gio.DBusConnection {
        if (this._connection === null) {
            throw new Error("DBus connection not initialized");
        }

        return this._connection;
    }

    getPlayerOwner(name: string) : string | undefined {
        if (!this._connection) {
            return undefined;
        }

        logDebug(`Getting owner for player: ${name}`);

        const result = this._connection.call_sync(
            'org.freedesktop.DBus',
            '/org/freedesktop/DBus',
            'org.freedesktop.DBus',
            'GetNameOwner',
            new GLib.Variant('(s)', [name]), 
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        );

        const [owner] = smartUnpack(result) as [string?];

        return owner || undefined;
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

    getPlayer(name: string) : MediaPlayer | undefined {
        return this._players.get(name);
    }

    private _nameOwnerChanged(connection: Gio.DBusConnection, sender_name: string | null, object_path: string, interface_name: string, signal_name: string, parameters: GLib.Variant) {     
        const [name, oldOwner, newOwner] : [string?, string?, string?] = smartUnpack(parameters);
        if (!name?.startsWith(PLAYER_INTERFACE)) {
            return;
        }

        logDebug(`NameOwnerChanged: ${sender_name} ${object_path} ${interface_name} ${signal_name}`);
        logObject(parameters, {json: true});
        if (name === undefined || oldOwner === undefined || newOwner === undefined) {
            return;
        }
        
        if (oldOwner === newOwner || oldOwner.length === 0 && this._players.has(newOwner)) {
            return;

        }   

        if (newOwner.length === 0 && this._players.has(oldOwner)) {
            const player = this._players.get(oldOwner);
            
            if (player) {
                player.removePlayer();
                this._players.delete(oldOwner);
            }

            return;
        }

        if (newOwner.length > 0 && !this._players.has(newOwner)) {
            const player = new MediaPlayer(name, newOwner, this);
            this._players.set(newOwner, player);
        }
        

        // const unpacked: any[] = smartUnpack(parameters);
        // if(!Array.isArray(unpacked) || unpacked.length < 2) {
        //     return;
        // }
        
        // const [oldOwner, newOwner] = unpacked;
        // if (oldOwner === newOwner) {
        //     return;
        // }

        // if (this._players.has(sender_name)) {
        //     this._players.delete(sender_name);
        // }
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