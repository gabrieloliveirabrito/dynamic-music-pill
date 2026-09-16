import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { CrossfadeArt } from "@/components";
import { SettingsProvider } from "@/providers/settings-provider";
import { MusicPillState } from "./state";
import { TextBlock } from "./components/text-block";
import { PlaybackStatus } from "@/types/player-types";

export type PillDisplayPayload = {
    title?: string;
    artist?: string;
    artUrl?: string;
    status: PlaybackStatus;
    busName: string | null;
};

export class MusicPill extends St.Widget {
    static {
        GObject.registerClass(this);
    }

    readonly textBlock: TextBlock;
    private _settings: SettingsProvider;
    private _state: MusicPillState;
    private _body: St.BoxLayout;
    private _artWidget: CrossfadeArt;
    private _currentStatus: PlaybackStatus = "Stopped";

    constructor(settings: SettingsProvider) {
        super({
            style_class: "music-pill-container",
            reactive: false,
            layout_manager: new Clutter.BinLayout(),
            y_expand: true,
            y_align: Clutter.ActorAlign.FILL,
            x_align: Clutter.ActorAlign.CENTER,
            opacity: 0,
            width: 0,
            visible: false,
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
        });
        this._body.set_pivot_point(0.5, 0.5);

        this._artWidget = new CrossfadeArt();
        const artBin = new St.Bin({
            child: this._artWidget as unknown as St.Widget,
            style: "margin-right: 8px;",
            x_expand: false,
            y_expand: false,
        });

        this.textBlock = new TextBlock();

        this._body.add_child(artBin);
        this._body.add_child(this.textBlock);
        this.add_child(this._body);
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
    }

    updateDisplay(payload: PillDisplayPayload): void {
        if (!this.get_parent()) {
            return;
        }

        const hasContent = !!(payload.title || payload.status === "Playing" || payload.status === "Paused");

        this.setStatus(payload.status);
        this.setBusName(payload.busName);

        if (payload.title) {
            this.setTitle(payload.title);
        }
        if (payload.artist !== undefined) {
            this.setArtist(payload.artist);
        }
        if (payload.artUrl !== undefined) {
            this.setArtUrl(payload.artUrl);
        }

        this.textBlock.setPlayerPaused(payload.status !== "Playing");

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
            return;
        }
        if (url) {
            this._artWidget.setArt(url, true);
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
    }
}
