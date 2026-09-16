import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import GLib from "gi://GLib";
import { CrossfadeArt } from "@/components";
import { SettingsProvider } from "@/providers/settings-provider";
import { MusicPillState } from "./state";
import { TextBlock } from "./components/text-block";
import { PlaybackStatus } from "@/types/player-types";
import { WaveformVisualizer } from "@/ui/visualizers";
import { Color } from "@/types/color";

export type PillDisplayPayload = {
    title?: string;
    artist?: string;
    artUrl?: string;
    status: PlaybackStatus;
    busName: string | null;
};

export type PillActionHandler = (action: string) => void;

export class MusicPill extends St.Widget {
    static {
        GObject.registerClass(this);
    }

    readonly textBlock: TextBlock;
    private _settings: SettingsProvider;
    private _state: MusicPillState;
    private _body: St.BoxLayout;
    private _artWidget: CrossfadeArt;
    private _artBin: St.Bin;
    private _visualizer: WaveformVisualizer;
    private _currentStatus: PlaybackStatus = "Stopped";
    private _lastArtUrl: string | null = null;
    private _onAction: PillActionHandler | null = null;
    private _clickTimer: number | null = null;
    private _lastClick = 0;

    constructor(settings: SettingsProvider) {
        super({
            style_class: "music-pill-container",
            reactive: true,
            layout_manager: new Clutter.BinLayout(),
            y_expand: true,
            y_align: Clutter.ActorAlign.FILL,
            x_align: Clutter.ActorAlign.CENTER,
            opacity: 0,
            width: 0,
            visible: false,
            can_focus: true,
            track_hover: true,
        } as unknown as St.Widget.ConstructorProps);

        this._settings = settings;
        this._state = {
            lastScrollTime: 0,
            isActive: false,
            targetWidth: 250,
            paddingX: 14,
            paddingY: 6,
            radius: 28,
            shadowCSS: "box-shadow: none",
            inPanel: false,
            gameMode: false,
            currentBusName: null,
            displayedColor: { r: 40, g: 40, b: 40 },
            targetColor: { r: 40, g: 40, b: 40 },
            colorAnimId: null,
            hideGraceTimer: null,
            lastBodyCss: null,
            lastLeftCss: null,
            lastRightCss: null,
        };

        this._body = new St.BoxLayout({
            style_class: "pill-body",
            x_expand: false,
            y_expand: false,
            y_align: Clutter.ActorAlign.CENTER,
            style: "spacing: 6px;",
        });
        this._body.set_pivot_point(0.5, 0.5);

        this._artWidget = new CrossfadeArt();
        this._artBin = new St.Bin({
            child: this._artWidget as unknown as St.Widget,
            style: "margin-right: 4px;",
            x_expand: false,
            y_expand: false,
        });

        this.textBlock = new TextBlock();
        this._visualizer = new WaveformVisualizer(24, settings, false);
        this._visualizer.setMode(settings.style.visualizerAnimation || 1);

        this._body.add_child(this._artBin);
        this._body.add_child(this.textBlock as unknown as St.Widget);
        this._body.add_child(this._visualizer as unknown as St.Widget);
        this.add_child(this._body);

        this.connect("button-release-event", (_a, event) => this._onButton(event as unknown as Clutter.Event));
        this.connect("scroll-event", (_a, event) => this._onScroll(event as unknown as Clutter.Event));
    }

    setActionHandler(handler: PillActionHandler): void {
        this._onAction = handler;
    }

    get displayedColor(): Color {
        return this._state.displayedColor;
    }

    get lastArtUrl(): string | null {
        return this._lastArtUrl;
    }

    get currentBgAlpha(): number {
        return 0.95;
    }

    updateDimensions(): void {
        const height = this._settings.pill.dockHeight;
        const width = this._settings.pill.dynamicWidth ? -1 : this._settings.pill.dockWidth;
        this._state.targetWidth = width === -1 ? 250 : width;
        this._body.set_height(height);
        if (width > 0) {
            this._body.set_width(width);
        }
        this.set_height(height);
        this._visualizer.setHeightClamped(Math.max(8, height - 8));
    }

    updateDisplay(payload: PillDisplayPayload): void {
        if (!this.get_parent()) {
            return;
        }

        const hasContent = !!(payload.title || payload.status === "Playing" || payload.status === "Paused");
        this._currentStatus = payload.status;
        this._state.currentBusName = payload.busName;

        if (payload.title) {
            this.textBlock.setTitle(payload.title);
        }
        if (payload.artist !== undefined) {
            this.textBlock.setArtist(payload.artist);
        }
        if (payload.artUrl !== undefined) {
            this.setArtUrl(payload.artUrl);
        }

        this.textBlock.setPlayerPaused(payload.status !== "Playing");
        this._visualizer.setPlaying(payload.status === "Playing" && !this._settings.popup.hidePillVisualizer);

        if (hasContent) {
            this.showActive();
        } else {
            this.hideInactive();
        }
    }

    setTitle(title: string): void {
        this.textBlock.setTitle(title);
    }

    setArtist(artist: string): void {
        this.textBlock.setArtist(artist);
    }

    setArtUrl(url: string | undefined): void {
        if (!this._settings.pill.showAlbumArt) {
            this._artBin.hide();
            return;
        }
        if (url) {
            this._artBin.show();
            this._artWidget.setArt(url, true);
            this._lastArtUrl = url;
        } else {
            this._artBin.hide();
            this._lastArtUrl = null;
        }
    }

    setStatus(status: PlaybackStatus): void {
        this._currentStatus = status;
    }

    setBusName(busName: string | null): void {
        this._state.currentBusName = busName;
    }

    showActive(): void {
        this._state.isActive = true;
        this.visible = true;
        this.reactive = true;
        this.set_width(-1);
        this.opacity = 255;
        this.updateDimensions();
    }

    hideInactive(): void {
        if (this._settings.pill.alwaysShow && this._state.currentBusName) {
            this.textBlock.setTitle("Sem mídia");
            this.textBlock.setArtist("Aguardando reprodução...");
            this.showActive();
            return;
        }
        this._state.isActive = false;
        this.reactive = false;
        this.opacity = 0;
        this.visible = false;
        this.set_width(0);
        this._visualizer.setPlaying(false);
    }

    private _emit(action: string): void {
        if (action && action !== "none") {
            this._onAction?.(action);
        }
    }

    private _onButton(event: Clutter.Event): boolean {
        const button = event.get_button();
        if (button === 2) {
            this._emit(this._settings.mouseActions.middleClick);
            return Clutter.EVENT_STOP;
        }
        if (button === 3) {
            this._emit(this._settings.mouseActions.rightClick);
            return Clutter.EVENT_STOP;
        }
        if (button !== 1) {
            return Clutter.EVENT_PROPAGATE;
        }

        const now = Date.now();
        const doubleAction = this._settings.mouseActions.doubleClick;
        const singleAction = this._settings.mouseActions.leftClick;

        if (!doubleAction || doubleAction === "none") {
            this._emit(singleAction);
            return Clutter.EVENT_STOP;
        }

        if (this._lastClick && now - this._lastClick <= 220) {
            this._lastClick = 0;
            if (this._clickTimer !== null) {
                GLib.source_remove(this._clickTimer);
                this._clickTimer = null;
            }
            this._emit(doubleAction);
        } else {
            this._lastClick = now;
            if (this._clickTimer !== null) {
                GLib.source_remove(this._clickTimer);
            }
            this._clickTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 220, () => {
                this._clickTimer = null;
                this._lastClick = 0;
                this._emit(singleAction);
                return GLib.SOURCE_REMOVE;
            });
        }
        return Clutter.EVENT_STOP;
    }

    private _onScroll(event: Clutter.Event): boolean {
        const dir = event.get_scroll_direction();
        if (dir === Clutter.ScrollDirection.UP) {
            this._emit("previous");
            return Clutter.EVENT_STOP;
        }
        if (dir === Clutter.ScrollDirection.DOWN) {
            this._emit("next");
            return Clutter.EVENT_STOP;
        }
        return Clutter.EVENT_PROPAGATE;
    }
}
