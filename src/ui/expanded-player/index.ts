import GObject from "gi://GObject";
import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { PixelSnappedBox } from "@/components";
import { SettingsProvider } from "@/providers/settings-provider";
import { MediaPlayer } from "@/providers/mpris-provider/media-player";
import { PlaybackStatus } from "@/types/player-types";
import { disableDashToDockAutohide, restoreDashToDockAutohide } from "@/utils/dash-to-dock";
import { TrackInfoBlock } from "./components/track-info";
import { ProgressBar } from "./components/progress-bar";
import { TransportControls } from "./components/transport-controls";
import { VinylArt } from "./components/vinyl-art";
import { WaveformVisualizer } from "@/ui/visualizers";

export type ExpandedPlayerHost = {
    settings: SettingsProvider;
    togglePlayback(): void;
    next(): void;
    previous(): void;
    seekTo(player: MediaPlayer, positionUs: number): void;
};

export class ExpandedPlayer extends St.Widget {
    static {
        GObject.registerClass(this);
    }

    readonly box: St.BoxLayout;
    private _host: ExpandedPlayerHost;
    private _player: MediaPlayer | null = null;
    private _timer: number | null = null;
    private _vinyl: VinylArt;
    private _info: TrackInfoBlock;
    private _progress: ProgressBar;
    private _transport: TransportControls;
    private _visualizer: WaveformVisualizer;
    private _bgBtn: St.Button;
    private _seekLockTime = 0;
    private _lastPositionSync = 0;
    private _lastTickPosition: number | undefined;
    private _lastTickTime: number | undefined;
    private _lastCapsKey = "";

    constructor(host: ExpandedPlayerHost) {
        const [bgW, bgH] = global.display.get_size();
        super({
            width: bgW,
            height: bgH,
            reactive: true,
            visible: false,
            x: 0,
            y: 0,
        } as unknown as St.Widget.ConstructorProps);

        this._host = host;

        this._bgBtn = new St.Button({
            style: "background-color: transparent;",
            reactive: true,
            x_expand: true,
            y_expand: true,
            width: bgW,
            height: bgH,
        });
        this._bgBtn.connect("clicked", () => this.hidePopup());
        this.add_child(this._bgBtn);

        this.box = new PixelSnappedBox({
            style_class: "music-pill-expanded",
            reactive: true,
            style: "padding: 16px; border-radius: 16px; background-color: rgba(30,30,30,0.95);",
        }) as unknown as St.BoxLayout;
        this.box.layout_manager.orientation = Clutter.Orientation.VERTICAL;
        this.add_child(this.box);

        this._vinyl = new VinylArt();
        this._vinyl.setSquare(host.settings.popup.squareVinyl);
        this._vinyl.setSpeed(host.settings.popup.vinylSpeed);
        this._info = new TrackInfoBlock();
        this._visualizer = new WaveformVisualizer(80, host.settings, true);
        this._visualizer.setMode(host.settings.style.visualizerAnimation);

        const top = new St.BoxLayout({
            style_class: "expanded-top-row",
            vertical: false,
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
        });
        top.add_child(this._vinyl as unknown as St.Widget);
        const mid = new St.BoxLayout({ vertical: true, x_expand: true, style: "spacing: 8px;" });
        mid.add_child(this._info as unknown as St.Widget);
        mid.add_child(this._visualizer as unknown as St.Widget);
        top.add_child(mid);
        this.box.add_child(top);

        this._progress = new ProgressBar();
        // Hours format only kicks in for tracks ≥1h (legacy); setting is a gate
        this._progress.setForceHours(host.settings.popup.showHoursFormat);
        this._progress.setSeekHandler(ratio => this._onSeek(ratio));
        this.box.add_child(this._progress as unknown as St.Widget);

        this._transport = new TransportControls({
            onPrevious: () => this._host.previous(),
            onPlayPause: () => this._host.togglePlayback(),
            onNext: () => this._host.next(),
        });
        this.box.add_child(this._transport as unknown as St.Widget);

        this.connect("key-press-event", (_a, event) => {
            if (event.get_key_symbol() === Clutter.KEY_Escape) {
                this.hidePopup();
                return Clutter.EVENT_STOP;
            }
            return Clutter.EVENT_PROPAGATE;
        });

        this.connect("destroy", () => this._cleanup());
    }

    setPlayer(player: MediaPlayer | null): void {
        this._player = player;
    }

    updateStyle(r: number, g: number, b: number, alpha = 0.95): void {
        this.box.set_style(
            `padding: 16px; border-radius: 16px; background-color: rgba(${r},${g},${b},${alpha});`
        );
        this._visualizer.setColor({ r, g, b });
    }

    private _lastContentKey = "";

    updateContent(title: string | null, artist: string | null, artUrl: string | null, status: PlaybackStatus): void {
        const key = `${title ?? ""}|${artist ?? ""}|${artUrl ?? ""}|${status}`;
        if (key === this._lastContentKey) {
            // Still refresh play icon / caps lightly
            this._transport.setStatus(status);
            this._visualizer.setPlaying(status === "Playing" && this._host.settings.popup.showVisualizer);
            this._vinyl.setSpinning(
                status === "Playing"
                && this._host.settings.popup.showVinyl
                && this._host.settings.popup.vinylRotate
            );
            return;
        }
        this._lastContentKey = key;

        this._info.setTitle(title || "");
        this._info.setArtist(artist || "");
        this._info.setPaused(status !== "Playing");
        this._transport.setStatus(status);

        if (this._host.settings.popup.showVinyl) {
            this._vinyl.visible = true;
            this._vinyl.setArt(artUrl);
            this._vinyl.setSpinning(status === "Playing" && this._host.settings.popup.vinylRotate);
        } else {
            this._vinyl.visible = false;
            this._vinyl.setSpinning(false);
        }

        if (this._host.settings.popup.showVisualizer) {
            this._visualizer.visible = true;
            this._visualizer.setPlaying(status === "Playing");
        } else {
            this._visualizer.visible = false;
            this._visualizer.setPlaying(false);
        }

        if (this._player) {
            const info = this._player.getPlayerInfo();
            this._transport.setCapabilities(info.canGoPrevious, info.canPlay || info.canPause, info.canGoNext);
        }
    }

    showFor(player: MediaPlayer, artUrl: string | null): void {
        this._player = player;
        const track = player.getTrackInfo();
        const status = player.getPlayerInfo().playbackStatus;
        this.updateContent(track?.title ?? null, track?.artist?.join(", ") ?? null, artUrl, status);
        this._startTimer();
        disableDashToDockAutohide();
        this.visible = true;
        this.opacity = 0;
        (this as unknown as { ease: Function }).ease({
            opacity: 255,
            duration: 180,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });
        global.stage.set_key_focus(this);
    }

    hidePopup(): void {
        this._stopTimer();
        restoreDashToDockAutohide();
        (this as unknown as { ease: Function }).ease({
            opacity: 0,
            duration: 150,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onStopped: () => {
                this.visible = false;
                this.destroy();
            },
        });
    }

    /** Alias used by controller to match legacy `hide()`. */
    hide(): void {
        this.hidePopup();
    }

    setPositionNearPill(px: number, py: number, pw: number, ph: number): void {
        const monitor = Main.layoutManager.findMonitorForActor(this)
            ?? Main.layoutManager.primaryMonitor;
        if (!monitor) {
            return;
        }
        this.box.set_width(-1);
        const [, natW] = this.box.get_preferred_width(-1);
        const [, natH] = this.box.get_preferred_height(natW);
        let w = this._host.settings.popup.useCustomWidth
            ? Math.max(this._host.settings.popup.customWidth, 280)
            : Math.min(Math.max(natW || 320, 280), 600);
        const h = natH > 0 ? natH : 220;

        let x = px + (pw - w) / 2;
        let y = py - h - 12;
        if (y < monitor.y + 8) {
            y = py + ph + 12;
        }
        x = Math.max(monitor.x + 8, Math.min(x, monitor.x + monitor.width - w - 8));
        this.box.set_position(Math.round(x), Math.round(y));
        this.box.set_size(Math.round(w), Math.round(h));
    }

    private _onSeek(ratio: number): void {
        if (!this._player) {
            return;
        }
        const length = this._player.getTrackInfo()?.length || 0;
        if (length <= 0) {
            return;
        }
        const targetPos = Math.floor(length * ratio);
        this._seekLockTime = Date.now();
        this._player.markPosition(targetPos);
        this._progress.applySeekPreview(targetPos, length);
        this._host.seekTo(this._player, targetPos);
    }

    private _startTimer(): void {
        this._stopTimer();
        this._lastTickPosition = undefined;
        this._lastTickTime = undefined;
        this._lastPositionSync = 0;
        this._player?.syncPosition();
        // Legacy uses 100ms — smooth fill without thrashing labels (labels gate on change)
        this._timer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
            this._tick();
            return GLib.SOURCE_CONTINUE;
        });
        this._tick();
    }

    private _stopTimer(): void {
        if (this._timer !== null) {
            GLib.source_remove(this._timer);
            this._timer = null;
        }
    }

    private _tick(): void {
        if (!this._player || !this.get_parent()) {
            return;
        }

        const length = this._player.getTrackInfo()?.length || 0;
        if (length <= 0) {
            return;
        }

        const now = Date.now();
        if (now - this._seekLockTime < 2000) {
            return;
        }

        const info = this._player.getPlayerInfo();
        const playing = info.playbackStatus === "Playing";

        if (playing && (!this._lastPositionSync || now - this._lastPositionSync > 5000)) {
            this._lastPositionSync = now;
            this._player.syncPosition();
        }

        const cachedPos = this._player.getCachedPosition();
        const lastUpdate = this._player.getLastPositionTime() || now;

        let isStale = false;
        if (playing) {
            if (cachedPos === (this._lastTickPosition || 0)
                && (now - lastUpdate) > 6000
                && this._lastTickTime
                && (now - this._lastTickTime) > 6000) {
                isStale = true;
            }
            if (cachedPos !== (this._lastTickPosition || 0)) {
                this._lastTickTime = now;
            }
            this._lastTickPosition = cachedPos;
        }

        let currentPos = cachedPos;
        if (playing && !isStale) {
            currentPos += (now - lastUpdate) * 1000;
        }
        if (currentPos > length) {
            currentPos = length;
        }

        this._progress.update(currentPos, length, isStale && playing);

        this._transport.setStatus(info.playbackStatus);
        const capsKey = `${info.canGoPrevious}|${info.canPlay || info.canPause}|${info.canGoNext}`;
        if (capsKey !== this._lastCapsKey) {
            this._lastCapsKey = capsKey;
            this._transport.setCapabilities(
                info.canGoPrevious,
                info.canPlay || info.canPause,
                info.canGoNext,
            );
        }
    }

    private _cleanup(): void {
        this._stopTimer();
        restoreDashToDockAutohide();
        this._player = null;
    }
}
