import GLib from "gi://GLib";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { AppContext } from "@/types/app-context";
import { DisplayTrack, PlaybackStatus } from "@/types/player-types";
import { MediaPlayer } from "@/providers/mpris-provider/media-player";
import { MPRISProvider } from "@/providers/mpris-provider";
import { getActivePlayer, resolveDisplayTrack } from "./active-player";
import { MusicPill } from "@/ui/music-pill";
import { createPillInjector, PillInjector } from "@/ui/music-pill/positioning/inject";
import { ExpandedPlayer } from "@/ui/expanded-player";
import { PlayerSelectorMenu } from "@/ui/player-selector";
import { initDTDModule } from "@/utils/dash-to-dock";
import { logDebug } from "@/utils/log";

export class MusicController {
    private _context: AppContext;
    private _pill: MusicPill | null = null;
    private _injector: PillInjector | null = null;
    private _expanded: ExpandedPlayer | null = null;
    private _playerMenu: PlayerSelectorMenu | null = null;
    private _lastWinnerName: string | null = null;
    private _lastActionTime = 0;
    private _lastDisplay: DisplayTrack | null = null;
    private _updateTimeoutId: number | null = null;
    private _watchdogId: number | null = null;
    private _signalIds: number[] = [];
    private _settingsSignalIds: number[] = [];
    private _overviewDragBegin = 0;
    private _overviewDragEnd = 0;
    private _isShuttingDown = false;

    constructor(context: AppContext) {
        this._context = context;
    }

    enable(): void {
        this._isShuttingDown = false;
        initDTDModule();
        this._createPill();
        this._context.mpris.setSystemSettings(this._context.settings.system);
        this._bindMprisSignals(this._context.mpris);
        this._bindSettingsSignals();

        if (Main.layoutManager._startingUp) {
            const startupId = Main.layoutManager.connect("startup-complete", () => {
                Main.layoutManager.disconnect(startupId);
                this._doEnable();
            });
        } else {
            this._doEnable();
        }
    }

    disable(): void {
        this._isShuttingDown = true;
        this._clearTimers();
        this._unbindSignals();
        this.closePlayerMenu();
        if (this._expanded) {
            this._expanded.destroy();
            this._expanded = null;
        }
        this._injector?.destroy();
        this._injector = null;
        if (this._pill) {
            this._pill.destroy();
            this._pill = null;
        }
        this._lastDisplay = null;
        this._lastWinnerName = null;
    }

    performAction(action: string): void {
        switch (action) {
            case "play_pause":
                this.togglePlayback();
                break;
            case "next":
                this.next();
                break;
            case "previous":
                this.previous();
                break;
            case "toggle_menu":
                this.toggleMenu();
                break;
            case "open_player_menu":
                this.togglePlayerMenu();
                break;
            case "open_settings":
                this._context.extension.openPreferences();
                break;
            case "open_app":
                this._getActivePlayerInstance()?.raise();
                break;
            case "close_app":
                this._getActivePlayerInstance()?.quit();
                break;
            default:
                logDebug(`Unknown action: ${action}`);
        }
    }

    togglePlayback(): void {
        this._getActivePlayerInstance()?.playPause();
    }

    next(): void {
        this._lastActionTime = Date.now();
        this._getActivePlayerInstance()?.next();
        this.triggerUpdate();
    }

    previous(): void {
        this._lastActionTime = Date.now();
        this._getActivePlayerInstance()?.previous();
        this.triggerUpdate();
    }

    seekTo(player: MediaPlayer, positionUs: number): void {
        try {
            player.setPosition(positionUs);
            this.triggerUpdate();
        } catch (e) {
            logDebug(`seekTo failed: ${(e as Error).message}`);
        }
    }

    selectPlayer(busName: string): void {
        this._context.settings.popup.selectedPlayerBus = busName;
        this.triggerUpdate();
    }

    toggleMenu(): void {
        if (this._expanded) {
            this._expanded.hidePopup();
            return;
        }
        const player = this._getActivePlayerInstance();
        if (!player || !this._pill) {
            return;
        }

        this._expanded = new ExpandedPlayer({
            settings: this._context.settings,
            togglePlayback: () => this.togglePlayback(),
            next: () => this.next(),
            previous: () => this.previous(),
            seekTo: (p, pos) => this.seekTo(p, pos),
        });
        this._expanded.connect("destroy", () => {
            this._expanded = null;
        });
        Main.layoutManager.addChrome(this._expanded);

        const color = this._pill.displayedColor;
        this._expanded.updateStyle(color.r, color.g, color.b, this._pill.currentBgAlpha);

        const [px, py] = this._pill.get_transformed_position();
        const [pw, ph] = this._pill.get_transformed_size();
        this._expanded.showFor(player, this._pill.lastArtUrl);
        this._expanded.setPositionNearPill(px, py, pw, ph);
    }

    togglePlayerMenu(): void {
        if (this._playerMenu) {
            this._playerMenu.hideMenu();
            return;
        }
        if (!this._pill) {
            return;
        }

        this._playerMenu = new PlayerSelectorMenu({
            settings: this._context.settings,
            getPlayers: () => this._context.mpris.getPlayers(),
            selectPlayer: bus => this.selectPlayer(bus),
            closePlayerMenu: () => this.closePlayerMenu(),
        });
        this._playerMenu.connect("destroy", () => {
            this._playerMenu = null;
        });
        Main.layoutManager.addChrome(this._playerMenu);

        const [px, py] = this._pill.get_transformed_position();
        const [pw, ph] = this._pill.get_transformed_size();
        this._playerMenu.showMenu(px, py, pw, ph);
    }

    closePlayerMenu(): void {
        if (!this._playerMenu) {
            return;
        }
        Main.layoutManager.removeChrome(this._playerMenu);
        this._playerMenu.destroy();
        this._playerMenu = null;
    }

    triggerUpdate(): void {
        if (this._updateTimeoutId !== null) {
            return;
        }
        const delay = this._context.settings.system.compatibilityDelay ? 800 : 150;
        this._updateTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
            this._updateTimeoutId = null;
            this._updateUI();
            return GLib.SOURCE_REMOVE;
        });
    }

    private _doEnable(): void {
        this._context.mpris.start(this._context.settings.system);
        this._injector?.inject();
        this._watchdogId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 5, () => {
            if (this._isShuttingDown) {
                return GLib.SOURCE_REMOVE;
            }
            if (!this._pill?.get_parent()) {
                this._injector?.queueInject();
            }
            return GLib.SOURCE_CONTINUE;
        });
        this._overviewDragBegin = Main.overview.connect("item-drag-begin", () => {});
        this._overviewDragEnd = Main.overview.connect("item-drag-end", () => {
            this._injector?.queueInject();
        });
        this._context.mpris.rescan();
        this.triggerUpdate();
    }

    private _createPill(): void {
        if (this._pill) {
            return;
        }
        this._pill = new MusicPill(this._context.settings);
        this._pill.setActionHandler(action => this.performAction(action));
        this._injector = createPillInjector(this._pill, this._context.settings);
        this._pill.connect("destroy", () => {
            this._pill = null;
            if (!this._isShuttingDown) {
                this._injector?.queueInject();
            }
        });
    }

    private _bindMprisSignals(mpris: MPRISProvider): void {
        const handler = () => this.triggerUpdate();
        this._signalIds.push(
            mpris.connect("player-added", handler),
            mpris.connect("player-removed", handler),
            mpris.connect("player-state-changed", handler),
            mpris.connect("player-track-changed", handler),
            mpris.connect("player-status-changed", handler),
        );
    }

    private _bindSettingsSignals(): void {
        const { settings, mpris } = this._context;
        const rescan = () => {
            mpris.setSystemSettings(settings.system);
            mpris.rescan();
            this.triggerUpdate();
        };
        const reinject = () => this._injector?.queueInject();
        this._settingsSignalIds.push(
            settings.gioInternal.connect("changed::player-filter-mode", rescan),
            settings.gioInternal.connect("changed::player-filter-list", rescan),
            settings.gioInternal.connect("changed::target-container", reinject),
            settings.gioInternal.connect("changed::position-mode", reinject),
            settings.gioInternal.connect("changed::dock-position", reinject),
            settings.gioInternal.connect("changed::selected-player-bus", () => this.triggerUpdate()),
        );
    }

    private _getActivePlayerInstance(): MediaPlayer | null {
        return getActivePlayer({
            settings: this._context.settings,
            players: this._context.mpris.getPlayers(),
            lastActionTime: this._lastActionTime,
            lastWinnerName: this._lastWinnerName,
        });
    }

    private _updateUI(): void {
        if (!this._pill) {
            this._createPill();
        }
        if (!this._pill) {
            return;
        }
        if (!this._pill.get_parent()) {
            this._injector?.inject();
        }

        const active = this._getActivePlayerInstance();
        if (!active) {
            this._pill.updateDisplay({
                title: undefined,
                artist: undefined,
                artUrl: undefined,
                status: "Stopped",
                busName: null,
            });
            return;
        }

        if (this._lastWinnerName !== active.getBusName()) {
            this._lastDisplay = null;
        }
        this._lastWinnerName = active.getBusName();

        const display = resolveDisplayTrack(active, this._lastDisplay);
        this._lastDisplay = display;
        const status = active.getPlayerInfo().playbackStatus as PlaybackStatus;

        this._pill.updateDisplay({
            title: display.title,
            artist: display.artist,
            artUrl: display.artUrl,
            status,
            busName: display.busName,
        });

        if (this._expanded?.visible) {
            this._expanded.setPlayer(active);
            this._expanded.updateContent(
                display.title ?? null,
                display.artist ?? null,
                display.artUrl ?? null,
                status
            );
        }
    }

    private _clearTimers(): void {
        if (this._updateTimeoutId !== null) {
            GLib.source_remove(this._updateTimeoutId);
            this._updateTimeoutId = null;
        }
        if (this._watchdogId !== null) {
            GLib.source_remove(this._watchdogId);
            this._watchdogId = null;
        }
    }

    private _unbindSignals(): void {
        for (const id of this._signalIds) {
            this._context.mpris.disconnect(id);
        }
        this._signalIds = [];
        for (const id of this._settingsSignalIds) {
            this._context.settings.gioInternal.disconnect(id);
        }
        this._settingsSignalIds = [];
        if (this._overviewDragBegin) {
            Main.overview.disconnect(this._overviewDragBegin);
            this._overviewDragBegin = 0;
        }
        if (this._overviewDragEnd) {
            Main.overview.disconnect(this._overviewDragEnd);
            this._overviewDragEnd = 0;
        }
    }
}
