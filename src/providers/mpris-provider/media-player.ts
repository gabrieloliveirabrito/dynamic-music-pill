import Gio from "gi://Gio"
import GLib from "gi://GLib"
import GObject from "gi://GObject"
import { TrackInfo, PlayerInfo, PlaybackStatus } from "@/types/player-types"
import { DBUS_PROPERTIES_INTERFACE, MPRIS_INTERFACE, MPRIS_OBJECT } from "@/constants/mpris-constants";
import { smartUnpack } from "@/utils/packing";
import { logDebug, logInfo, logObject } from "@/utils/log";
import { MPRISProvider } from ".";
import { checkChanged, mapObject } from "@/utils/mapper";
import { PlayerStateMap } from "./maps/player-state-map";
import { TrackInfoMap } from "./maps/track-info-map";

const DEFAULT_PLAYER_STATE: PlayerInfo = {
    playbackStatus: "Stopped",
    canControl: false,
    canGoNext: false,
    canGoPrevious: false,
    canPause: false,
    canPlay: false,
    canSeek: false,
    volume: 1.0,
    minimumRate: 1.0,
    maximumRate: 1.0,
    position: 0.0,
}

export type PlayerState = {
    player: PlayerInfo;
    trackInfo?: TrackInfo;
}


export class MediaPlayer extends GObject.Object {
    static {
        GObject.registerClass(this)
    }

    private _name: string;
    private _owner: string;
    private _mpris: MPRISProvider;
    private _connection: Gio.DBusConnection;
    private _playerPropertiesTimer: number | null = null;
    private _state: PlayerState

    constructor(name: string, owner: string, mpris: MPRISProvider) {
        super();
        logDebug(`Creating MediaPlayer for ${name}`);

        this._name = name;
        this._owner = owner;

        this._mpris = mpris;
        this._connection = mpris.getConnection();

        this._state = {
            player: {
                ...DEFAULT_PLAYER_STATE
            },
            trackInfo: undefined,
        }

        this._playerPropertiesTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, this._playerTimerCallback.bind(this));

        this._mpris.emit("player-added", this._name, this);
    }

    getPlayerState(): PlayerState {
        if (this._connection === null) {
            return this._state;
        }

        const [result] = smartUnpack(this._connection.call_sync(
            this._name,
            MPRIS_OBJECT,
            "org.freedesktop.DBus.Properties",
            'GetAll',
            new GLib.Variant('(s)', [MPRIS_INTERFACE]),
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        ));

        if (!result) {
            return this._state;
        }

        const playerState = mapObject(result, PlayerStateMap);
        const trackInfo = mapObject(result, TrackInfoMap);

        const state: PlayerState = {
            player: playerState,
            trackInfo: trackInfo,
        }

        return state;
    }

    getTrackInfo(): TrackInfo | undefined {
        return this._state.trackInfo;
    }

    getPlayerInfo(): PlayerInfo {
        return this._state.player;
    }

    getName(): string {
        return this._name;
    }

    getOwner(): string {
        return this._owner;
    }

    removePlayer() {
        logDebug(`Removing MediaPlayer for ${this._name}`);
        this._mpris.emit("player-removed", this._name, this);

        if (this._playerPropertiesTimer !== null) {
            GLib.source_remove(this._playerPropertiesTimer);
            this._playerPropertiesTimer = null;
        }

        this._state = {
            player: {...DEFAULT_PLAYER_STATE },
            trackInfo: undefined
        }
    }

    private _playerTimerCallback() {
        const newState = this.getPlayerState();
        const oldState = this._state;

        //logObject({ newTrackInfo: newState.trackInfo, oldTrackInfo: oldState.trackInfo }, { json: true });

        const [playerChanged, [playerPath, oldPlayerValue, newPlayerValue]] = checkChanged(oldState.player, newState.player);
        const [trackChanged, [trackPath, oldTrackValue, newTrackValue]] = checkChanged(oldState.trackInfo, newState.trackInfo);

        if (playerChanged) {
            this._state.player = newState.player;
            //logDebug(`Player changed: ${playerPath} ${oldPlayerValue} -> ${newPlayerValue}`);
            this._mpris.emit("player-state-changed", this._name, this);

            if (newState.player.playbackStatus !== oldState.player.playbackStatus) {
                this._mpris.emit("player-status-changed", this._name, newState.player.playbackStatus);
            }
        }

        if (trackChanged) {
            this._state.trackInfo = newState.trackInfo;
            //logDebug(`Track changed: ${trackPath} ${!!oldTrackValue ? JSON.stringify(oldTrackValue) : "undefined"} -> ${!!newTrackValue ? JSON.stringify(newTrackValue) : "undefined"}`);
            this._mpris.emit("player-track-changed", this._name, this);
        }

        return GLib.SOURCE_CONTINUE;
    }
}