import Gio from "gi://Gio";
import GObject from "gi://GObject";
import GLib from "gi://GLib";
import { getDBusSessionAddress } from "@/utils/development";
import { smartUnpack } from "@/utils/packing";
import { PLAYER_INTERFACE } from "@/constants/mpris-constants";
import { logDebug, logObject } from "@/utils/log";
import { MediaPlayer } from "./media-player";
import { isPlayerAllowed } from "./player-filter";
import { SystemSettingsType } from "@/providers/settings-provider/system";

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
        }, this);
    }

    private _address: string = getDBusSessionAddress();
    private _connection: Gio.DBusConnection | null = null;
    private _nameOwnerChangedSignal: number | null = null;
    /** keyed by MPRIS bus name */
    private _players: Map<string, MediaPlayer> = new Map();
    private _systemSettings: SystemSettingsType | null = null;

    constructor() {
        super();
    }

    start(systemSettings?: SystemSettingsType): void {
        this._systemSettings = systemSettings ?? null;
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

        this.rescan();
    }

    stop(): void {
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
        this._systemSettings = null;
    }

    setSystemSettings(systemSettings: SystemSettingsType): void {
        this._systemSettings = systemSettings;
    }

    getConnection(): Gio.DBusConnection {
        if (this._connection === null) {
            throw new Error("DBus connection not initialized");
        }
        return this._connection;
    }

    getPlayer(busName: string): MediaPlayer | undefined {
        return this._players.get(busName);
    }

    getPlayers(): MediaPlayer[] {
        return Array.from(this._players.values());
    }

    getPlayerBusNames(): string[] {
        return Array.from(this._players.keys());
    }

    rescan(): void {
        if (this._connection === null) {
            return;
        }

        const names = this.listPlayers().filter(name => this._shouldAllow(name));
        let changed = false;

        for (const name of names) {
            if (!this._players.has(name)) {
                const owner = this.getPlayerOwner(name);
                if (!owner) {
                    continue;
                }
                this._players.set(name, new MediaPlayer(name, owner, this));
                changed = true;
            }
        }

        for (const busName of [...this._players.keys()]) {
            if (!names.includes(busName)) {
                const player = this._players.get(busName);
                player?.removePlayer();
                this._players.delete(busName);
                changed = true;
            }
        }

        if (changed) {
            logDebug(`MPRIS rescan: ${this._players.size} player(s)`);
        }
    }

    getPlayerOwner(name: string): string | undefined {
        if (!this._connection) {
            return undefined;
        }

        try {
            const result = this._connection.call_sync(
                "org.freedesktop.DBus",
                "/org/freedesktop/DBus",
                "org.freedesktop.DBus",
                "GetNameOwner",
                new GLib.Variant("(s)", [name]),
                null,
                Gio.DBusCallFlags.NONE,
                -1,
                null
            );
            const [owner] = smartUnpack(result) as [string?];
            return owner || undefined;
        } catch {
            return undefined;
        }
    }

    listPlayers(): string[] {
        if (this._connection === null) {
            return [];
        }

        const result = this._connection.call_sync(
            "org.freedesktop.DBus",
            "/org/freedesktop/DBus",
            "org.freedesktop.DBus",
            "ListNames",
            null, null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        );

        const names = smartUnpack(result)[0] as string[];
        return names.filter(name => name.startsWith(`${PLAYER_INTERFACE}.`));
    }

    private _shouldAllow(busName: string): boolean {
        if (!this._systemSettings) {
            return true;
        }
        return isPlayerAllowed(busName, this._systemSettings);
    }

    private _nameOwnerChanged(
        _connection: Gio.DBusConnection,
        sender_name: string | null,
        object_path: string,
        interface_name: string,
        signal_name: string,
        parameters: GLib.Variant
    ): void {
        const [name, oldOwner, newOwner] = smartUnpack(parameters) as [string?, string?, string?];
        if (!name?.startsWith(PLAYER_INTERFACE)) {
            return;
        }

        logDebug(`NameOwnerChanged: ${sender_name} ${object_path} ${interface_name} ${signal_name}`);
        logObject(parameters, { json: true });

        if (name === undefined || oldOwner === undefined || newOwner === undefined) {
            return;
        }

        if (newOwner.length === 0 && this._players.has(name)) {
            const player = this._players.get(name);
            player?.removePlayer();
            this._players.delete(name);
            return;
        }

        if (newOwner.length > 0 && !this._players.has(name) && this._shouldAllow(name)) {
            this._players.set(name, new MediaPlayer(name, newOwner, this));
            return;
        }

        this.rescan();
    }
}
