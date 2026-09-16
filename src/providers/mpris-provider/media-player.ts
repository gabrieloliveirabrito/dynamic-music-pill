import Gio from "gi://Gio";
import GLib from "gi://GLib";
import GObject from "gi://GObject";
import { TrackInfo, PlayerInfo, PlaybackStatus, PlayerDescriptor } from "@/types/player-types";
import { DBUS_PROPERTIES_INTERFACE, MPRIS_INTERFACE, MPRIS_OBJECT, PLAYER_INTERFACE } from "@/constants/mpris-constants";
import { smartUnpack } from "@/utils/packing";
import { logDebug } from "@/utils/log";
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
};

export type PlayerState = {
    player: PlayerInfo;
    trackInfo?: TrackInfo;
};

export class MediaPlayer extends GObject.Object {
    static {
        GObject.registerClass(this);
    }

    private _busName: string;
    private _owner: string;
    private _mpris: MPRISProvider;
    private _connection: Gio.DBusConnection;
    private _playerPropertiesTimer: number | null = null;
    private _propertiesSignal: number | null = null;
    private _state: PlayerState;
    private _identity: string | null = null;
    private _desktopEntry: string | null = null;
    private _lastPlayingTime = 0;
    private _lastSeen = Date.now();
    private _lastTrackId: string | null = null;

    constructor(busName: string, owner: string, mpris: MPRISProvider) {
        super();
        logDebug(`Creating MediaPlayer for ${busName}`);

        this._busName = busName;
        this._owner = owner;
        this._mpris = mpris;
        this._connection = mpris.getConnection();
        this._state = {
            player: { ...DEFAULT_PLAYER_STATE },
            trackInfo: undefined,
        };

        this._fetchRootProperties();
        this._refreshState();

        this._propertiesSignal = this._connection.signal_subscribe(
            this._busName,
            DBUS_PROPERTIES_INTERFACE,
            "PropertiesChanged",
            MPRIS_OBJECT,
            null,
            Gio.DBusSignalFlags.NONE,
            this._onPropertiesChanged.bind(this)
        );

        this._playerPropertiesTimer = GLib.timeout_add(
            GLib.PRIORITY_DEFAULT,
            5000,
            this._fallbackPoll.bind(this)
        );

        this._mpris.emit("player-added", this._busName, this);
    }

    getDescriptor(): PlayerDescriptor {
        return {
            busName: this._busName,
            identity: this._identity ?? undefined,
            desktopEntry: this._desktopEntry ?? undefined,
            lastPlayingTime: this._lastPlayingTime,
            lastSeen: this._lastSeen,
        };
    }

    getPlayerState(): PlayerState {
        return this._state;
    }

    getTrackInfo(): TrackInfo | undefined {
        return this._state.trackInfo;
    }

    getPlayerInfo(): PlayerInfo {
        return this._state.player;
    }

    getName(): string {
        return this._busName;
    }

    getBusName(): string {
        return this._busName;
    }

    getOwner(): string {
        return this._owner;
    }

    getIdentity(): string | null {
        return this._identity;
    }

    getDesktopEntry(): string | null {
        return this._desktopEntry;
    }

    getLastPlayingTime(): number {
        return this._lastPlayingTime;
    }

    playPause(): void {
        this._callPlayerMethod("PlayPause");
    }

    next(): void {
        this._callPlayerMethod("Next");
    }

    previous(): void {
        this._callPlayerMethod("Previous");
    }

    seek(offsetMicros: number): void {
        this._connection.call_sync(
            this._busName,
            MPRIS_OBJECT,
            MPRIS_INTERFACE,
            "Seek",
            new GLib.Variant("(x)", [offsetMicros]),
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        );
    }

    removePlayer(): void {
        logDebug(`Removing MediaPlayer for ${this._busName}`);
        this._mpris.emit("player-removed", this._busName, this);

        if (this._propertiesSignal !== null) {
            this._connection.signal_unsubscribe(this._propertiesSignal);
            this._propertiesSignal = null;
        }

        if (this._playerPropertiesTimer !== null) {
            GLib.source_remove(this._playerPropertiesTimer);
            this._playerPropertiesTimer = null;
        }

        this._state = {
            player: { ...DEFAULT_PLAYER_STATE },
            trackInfo: undefined,
        };
    }

    private _callPlayerMethod(method: string): void {
        this._connection.call_sync(
            this._busName,
            MPRIS_OBJECT,
            MPRIS_INTERFACE,
            method,
            null,
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        );
    }

    private _fetchRootProperties(): void {
        try {
            const [result] = smartUnpack(this._connection.call_sync(
                this._busName,
                MPRIS_OBJECT,
                DBUS_PROPERTIES_INTERFACE,
                "GetAll",
                new GLib.Variant("(s)", [PLAYER_INTERFACE]),
                null,
                Gio.DBusCallFlags.NONE,
                -1,
                null
            )) as [Record<string, unknown>?];

            if (!result) {
                return;
            }

            if (result["Identity"]) {
                this._identity = String(smartUnpack(result["Identity"]));
            }
            if (result["DesktopEntry"]) {
                this._desktopEntry = String(smartUnpack(result["DesktopEntry"]));
            }
        } catch {
            // player may disappear during fetch
        }
    }

    private _refreshState(): void {
        try {
            const newState = this._fetchPlayerState();
            this._applyState(newState);
        } catch {
            // ignore transient dbus errors
        }
    }

    private _fetchPlayerState(): PlayerState {
        const [result] = smartUnpack(this._connection.call_sync(
            this._busName,
            MPRIS_OBJECT,
            DBUS_PROPERTIES_INTERFACE,
            "GetAll",
            new GLib.Variant("(s)", [MPRIS_INTERFACE]),
            null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        )) as [Record<string, unknown>?];

        if (!result) {
            return this._state;
        }

        const playerState = mapObject(result, PlayerStateMap);
        const trackInfo = mapObject(result, TrackInfoMap);

        return { player: playerState, trackInfo };
    }

    private _applyState(newState: PlayerState): void {
        const oldState = this._state;
        this._lastSeen = Date.now();

        if (newState.player.playbackStatus === "Playing") {
            this._lastPlayingTime = Date.now();
        }

        const trackId = newState.trackInfo?.trackId ?? null;
        if (trackId && trackId !== this._lastTrackId) {
            this._lastTrackId = trackId;
        }

        const [playerChanged] = checkChanged(oldState.player, newState.player);
        const [trackChanged] = checkChanged(oldState.trackInfo, newState.trackInfo);

        if (playerChanged) {
            this._state.player = newState.player;
            this._mpris.emit("player-state-changed", this._busName, this);

            if (newState.player.playbackStatus !== oldState.player.playbackStatus) {
                this._mpris.emit("player-status-changed", this._busName, newState.player.playbackStatus);
            }
        }

        if (trackChanged) {
            this._state.trackInfo = newState.trackInfo;
            this._mpris.emit("player-track-changed", this._busName, this);
        }
    }

    private _onPropertiesChanged(
        _connection: Gio.DBusConnection,
        _sender: string | null,
        _path: string,
        _iface: string,
        _signal: string,
        parameters: GLib.Variant
    ): void {
        const [iface, changed] = smartUnpack(parameters) as [string, Record<string, unknown>];
        if (iface !== MPRIS_INTERFACE || !changed) {
            return;
        }

        const merged = {
            ...this._flattenState(this._state),
            ...changed,
        };
        const playerState = mapObject(merged, PlayerStateMap);
        const trackInfo = mapObject(merged, TrackInfoMap);
        this._applyState({ player: playerState, trackInfo });
    }

    private _flattenState(state: PlayerState): Record<string, unknown> {
        const flat: Record<string, unknown> = {
            PlaybackStatus: state.player.playbackStatus,
            CanControl: state.player.canControl,
            CanGoNext: state.player.canGoNext,
            CanGoPrevious: state.player.canGoPrevious,
            CanPause: state.player.canPause,
            CanPlay: state.player.canPlay,
            CanSeek: state.player.canSeek,
            Volume: state.player.volume,
            MinimumRate: state.player.minimumRate,
            MaximumRate: state.player.maximumRate,
            Position: state.player.position,
        };

        if (state.trackInfo) {
            flat["xesam:title"] = state.trackInfo.title;
            flat["xesam:artist"] = state.trackInfo.artist;
            flat["xesam:album"] = state.trackInfo.album;
            flat["mpris:artUrl"] = state.trackInfo.artUrl;
            flat["mpris:length"] = state.trackInfo.length;
            flat["mpris:trackid"] = state.trackInfo.trackId;
        }

        return flat;
    }

    private _fallbackPoll(): boolean {
        this._refreshState();
        return GLib.SOURCE_CONTINUE;
    }
}
