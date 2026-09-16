import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { CrossfadeArt } from "@/components";
import { SettingsProvider } from "@/providers/settings-provider";
import { MusicPillState } from "./state";
import { TextBlock } from "./components/text-block";
import { TabletControls } from "./components/tablet-controls";
import { PlaybackStatus } from "@/types/player-types";
import { WaveformVisualizer } from "@/ui/visualizers";
import { Color } from "@/types/color";
import { applyPillBodyStyle } from "./handlers/style";
import { updatePillDimensions } from "./handlers/dimensions";
import { ArtColorLoader } from "./handlers/color-from-art";
import { setTargetColor, startColorTransition } from "./handlers/color-transition";

export type PillDisplayPayload = {
    title?: string;
    artist?: string;
    artUrl?: string;
    status: PlaybackStatus;
    busName: string | null;
};

export type PillActionHandler = (action: string) => void;

type Easeable = { ease(props: Record<string, unknown>): void };

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
    private _tabletControls: TabletControls;
    private _visualizer: WaveformVisualizer;
    private _visBin: St.Bin;
    private _currentStatus: PlaybackStatus = "Stopped";
    private _lastArtUrl: string | null = null;
    private _onAction: PillActionHandler | null = null;
    private _clickTimer: number | null = null;
    private _lastClick = 0;
    private _isPopupOpen = false;
    private _colorLoader = new ArtColorLoader();
    private _currentBgAlpha = 1.0;
    private _interfaceSettings: Gio.Settings | null = null;
    private _originalAccent: string | null = null;

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
            shadowCSS: "box-shadow: none;",
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

        try {
            this._interfaceSettings = new Gio.Settings({ schema_id: "org.gnome.desktop.interface" });
            this._originalAccent = this._interfaceSettings.get_string("accent-color");
        } catch {
            this._interfaceSettings = null;
        }

        this._body = new St.BoxLayout({
            style_class: "pill-body",
            x_expand: false,
            y_expand: false,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._body.set_pivot_point(0.5, 0.5);

        this._artWidget = new CrossfadeArt();
        this._artBin = new St.Bin({
            child: this._artWidget as unknown as St.Widget,
            style: "margin-right: 8px;",
            x_expand: false,
            y_expand: false,
        });

        this._tabletControls = new TabletControls();
        this._tabletControls.setActionHandler((action) => this._emit(action === "toggle" ? "play_pause" : action));

        this.textBlock = new TextBlock();
        this._visualizer = new WaveformVisualizer(24, settings, false);
        this._visBin = new St.Bin({
            child: this._visualizer as unknown as St.Widget,
            style: "margin-left: 8px;",
            x_align: Clutter.ActorAlign.END,
        });

        this._body.add_child(this._artBin);
        this._body.insert_child_at_index(this._tabletControls, 1);
        this._body.add_child(this.textBlock as unknown as St.Widget);
        this._body.add_child(this._visBin);
        this.add_child(this._body);

        this._updateTransparencyConfig();
        this._applyStyle();

        this.connect("enter-event", () => {
            this.textBlock.titleScroll.setHoverMode(true);
            this.textBlock.artistScroll.setHoverMode(true);
            return Clutter.EVENT_PROPAGATE;
        });
        this.connect("leave-event", () => {
            this.textBlock.titleScroll.setHoverMode(false);
            this.textBlock.artistScroll.setHoverMode(false);
            return Clutter.EVENT_PROPAGATE;
        });

        this.connect("button-press-event", () => {
            if (!this._body) return Clutter.EVENT_STOP;
            (this._body as unknown as Easeable).ease({
                scale_x: 0.96, scale_y: 0.96, duration: 80, mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            });
            return Clutter.EVENT_STOP;
        });
        this.connect("button-release-event", (_a, event) => this._onButton(event as unknown as Clutter.Event));
        this.connect("scroll-event", (_a, event) => this._onScroll(event as unknown as Clutter.Event));
        this.connect("destroy", () => this._cleanup());
    }

    private _cleanup(): void {
        this._colorLoader.cancel();
        if (this._state.colorAnimId !== null) {
            GLib.source_remove(this._state.colorAnimId);
            this._state.colorAnimId = null;
        }
        if (this._state.hideGraceTimer !== null) {
            GLib.source_remove(this._state.hideGraceTimer);
            this._state.hideGraceTimer = null;
        }
        if (this._clickTimer !== null) {
            GLib.source_remove(this._clickTimer);
            this._clickTimer = null;
        }
        if (this._interfaceSettings && this._settings.style.syncAccentColor) {
            try {
                this._interfaceSettings.set_string("accent-color", this._originalAccent || "blue");
            } catch { /* older GNOME */ }
        }
    }

    setActionHandler(handler: PillActionHandler): void {
        this._onAction = handler;
    }

    setPopupOpen(isOpen: boolean): void {
        this._isPopupOpen = isOpen;
        this.updateDimensions();
    }

    get displayedColor(): Color {
        return this._state.displayedColor;
    }

    get lastArtUrl(): string | null {
        return this._lastArtUrl;
    }

    get currentBgAlpha(): number {
        return this._currentBgAlpha;
    }

    private _updateTransparencyConfig(): void {
        const enableTrans = this._settings.style.enableTransparency;
        const strength = this._settings.style.transparencyStrength;
        this._currentBgAlpha = enableTrans ? (strength / 100.0) : 1.0;

        const targetOpacity = Math.floor(this._currentBgAlpha * 255);
        const setOp = (actor: St.Widget, enabled: boolean) => {
            actor.set_opacity(enabled && enableTrans ? targetOpacity : 255);
        };
        setOp(this._artBin, this._settings.style.artTransparency);
        this.textBlock.setTextOpacity(
            this._settings.style.textTransparency && enableTrans ? targetOpacity : 255
        );
        setOp(this._visBin, this._settings.style.visualizerTransparency);
    }

    updateDimensions(): void {
        updatePillDimensions(
            this._settings,
            this._state,
            {
                pill: this,
                body: this._body,
                artWidget: this._artWidget,
                artBin: this._artBin,
                textBlock: this.textBlock,
                visualizer: this._visualizer,
                visBin: this._visBin,
                tabletControls: this._tabletControls,
            },
            this._currentStatus,
            this._isPopupOpen,
        );
        this._updateTransparencyConfig();
        this._applyStyle();
    }

    private _lastTitle = "";
    private _lastArtist = "";
    private _lastArtUrlSeen: string | null | undefined = undefined;
    private _lastDisplayStatus: PlaybackStatus | null = null;

    updateDisplay(payload: PillDisplayPayload): void {
        if (!this.get_parent()) {
            return;
        }

        const title = payload.title ?? "";
        const artist = payload.artist ?? "";
        const artUrl = payload.artUrl;
        const status = payload.status;

        const sameText = title === this._lastTitle && artist === this._lastArtist;
        const sameArt = artUrl === this._lastArtUrlSeen;
        const sameStatus = status === this._lastDisplayStatus;
        const sameBus = payload.busName === this._state.currentBusName;

        // Lightweight path: only playing-state bits (no layout/style/color rebuild)
        if (sameText && sameArt && sameStatus && sameBus && this._state.isActive) {
            this.textBlock.setPlayerPaused(status !== "Playing");
            this._tabletControls.setPlaying(status === "Playing");
            this._visualizer.setPlaying(status === "Playing");
            return;
        }

        const hasContent = !!(payload.title || status === "Playing" || status === "Paused");
        this._currentStatus = status;
        this._state.currentBusName = payload.busName;
        this._lastDisplayStatus = status;

        if (!sameText) {
            if (payload.title) {
                this.textBlock.setTitle(payload.title);
                this._lastTitle = title;
            }
            if (payload.artist !== undefined) {
                this.textBlock.setArtist(payload.artist);
                this._lastArtist = artist;
            }
        }

        if (payload.artUrl !== undefined && !sameArt) {
            this.setArtUrl(payload.artUrl);
            this._lastArtUrlSeen = artUrl;
        }

        this.textBlock.setPlayerPaused(status !== "Playing");
        this._tabletControls.setPlaying(status === "Playing");
        this._visualizer.setPlaying(status === "Playing");

        if (hasContent) {
            this.showActive();
        } else {
            this.hideInactive();
        }

        // Color transition only when art/status meaningfully changes — not every poll
        if (!sameArt || !sameStatus) {
            this._startColorTransition();
        }
    }

    private _applyStyle(r?: number, g?: number, b?: number): void {
        if (!this._body) {
            return;
        }
        const color = {
            r: r ?? this._state.displayedColor.r,
            g: g ?? this._state.displayedColor.g,
            b: b ?? this._state.displayedColor.b,
        };
        applyPillBodyStyle(
            this._body,
            this._settings,
            this._state,
            color,
            this._currentBgAlpha,
            this._currentStatus === "Playing"
        );
        this._visualizer?.setColor(this._state.displayedColor);
    }

    private _startColorTransition(): void {
        startColorTransition(
            this._state,
            (r, g, b) => this._applyStyle(r, g, b),
            this._currentStatus === "Playing",
            () => !!this.get_parent(),
        );
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
            // Don't force=true — CrossfadeArt already no-ops if same URL; force restarted layers → flick
            this._artWidget.setArt(url, false);
            if (url !== this._lastArtUrl) {
                this._lastArtUrl = url;
                this._colorLoader.load(url, {
                    syncAccent: this._settings.style.syncAccentColor,
                    setAccent: (name) => {
                        try {
                            this._interfaceSettings?.set_string("accent-color", name);
                        } catch { /* ignore */ }
                    },
                    onColor: (color) => {
                        setTargetColor(this._state, color);
                        this._visualizer.setColor(color);
                        this._startColorTransition();
                    },
                });
            }
        } else {
            this._artBin.hide();
            this._lastArtUrl = null;
            this._startColorTransition();
        }
    }

    setStatus(status: PlaybackStatus): void {
        this._currentStatus = status;
    }

    setBusName(busName: string | null): void {
        this._state.currentBusName = busName;
    }

    showActive(): void {
        if (this._state.hideGraceTimer !== null) {
            GLib.source_remove(this._state.hideGraceTimer);
            this._state.hideGraceTimer = null;
        }

        const wasInactive = !this._state.isActive || this.opacity === 0 || this.width <= 1;
        this._state.isActive = true;
        this.visible = true;
        this.reactive = true;
        this.set_width(-1);

        if (!wasInactive) {
            // Already showing — don't rebuild dimensions/style (that was the flick)
            this.opacity = 255;
            return;
        }

        this.updateDimensions();

        const finalWidth = this._state.targetWidth > 0 ? this._state.targetWidth : this._body.width || 200;
        const finalHeight = this._settings.pill.dockHeight;
        this._body.set_width(0);
        this._body.set_height(finalHeight);
        this.opacity = 0;
        (this as unknown as Easeable).ease({
            opacity: 255, duration: 500, mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });
        (this._body as unknown as Easeable).ease({
            width: finalWidth, height: finalHeight, duration: 500, mode: Clutter.AnimationMode.EASE_OUT_QUAD,
        });
    }

    hideInactive(): void {
        if (this._settings.pill.alwaysShow && this._state.currentBusName) {
            this.textBlock.setTitle("Sem mídia");
            this.textBlock.setArtist("Aguardando reprodução...");
            this.showActive();
            return;
        }

        if (this._state.hideGraceTimer !== null || !this._state.isActive) {
            return;
        }

        this._state.hideGraceTimer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 5000, () => {
            this._state.hideGraceTimer = null;
            if (!this.get_parent()) {
                return GLib.SOURCE_REMOVE;
            }
            this._state.isActive = false;
            this.reactive = false;
            this._visualizer.setPlaying(false);

            const targetH = this._body.height;
            (this as unknown as Easeable).ease({
                opacity: 0, duration: 500, mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            });
            (this._body as unknown as Easeable).ease({
                width: 0,
                height: targetH,
                duration: 500,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                onStopped: (finished: boolean) => {
                    if (!finished) return;
                    this.set_width(0);
                    this.visible = false;
                },
            });
            return GLib.SOURCE_REMOVE;
        });
    }

    private _emit(action: string): void {
        if (action && action !== "none") {
            this._onAction?.(action);
        }
    }

    private _onButton(event: Clutter.Event): boolean {
        if (this._body) {
            (this._body as unknown as Easeable).ease({
                scale_x: 1.0, scale_y: 1.0, duration: 150, mode: Clutter.AnimationMode.EASE_OUT_BACK,
            });
        }

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
