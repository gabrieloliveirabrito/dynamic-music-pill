import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";

export type TabletControlAction = "previous" | "toggle" | "next";

/** Faithful port of tablet skip/play buttons from srcJS/uiMusicPill.js */
export class TabletControls extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    readonly prevBtn: St.Button;
    readonly playPauseBtn: St.Button;
    readonly nextBtn: St.Button;
    private _onAction: ((action: TabletControlAction) => void) | null = null;

    constructor() {
        super({
            vertical: false,
            y_align: Clutter.ActorAlign.CENTER,
            style: "margin-left: 6px;",
            visible: false,
        });

        this.prevBtn = new St.Button({
            style_class: "tablet-skip-btn",
            child: new St.Icon({ icon_name: "media-skip-backward-symbolic", icon_size: 20 }),
            reactive: true,
        });
        this.playPauseBtn = new St.Button({
            style_class: "tablet-skip-btn",
            child: new St.Icon({ icon_name: "media-playback-start-symbolic", icon_size: 20 }),
            reactive: true,
        });
        this.nextBtn = new St.Button({
            style_class: "tablet-skip-btn",
            child: new St.Icon({ icon_name: "media-skip-forward-symbolic", icon_size: 20 }),
            reactive: true,
        });

        this.add_child(this.prevBtn);
        this.add_child(this.playPauseBtn);
        this.add_child(this.nextBtn);

        this.prevBtn.connect("button-press-event", () => Clutter.EVENT_STOP);
        this.playPauseBtn.connect("button-press-event", () => Clutter.EVENT_STOP);
        this.nextBtn.connect("button-press-event", () => Clutter.EVENT_STOP);

        this.prevBtn.connect("button-release-event", () => {
            this._onAction?.("previous");
            return Clutter.EVENT_STOP;
        });
        this.playPauseBtn.connect("button-release-event", () => {
            this._onAction?.("toggle");
            return Clutter.EVENT_STOP;
        });
        this.nextBtn.connect("button-release-event", () => {
            this._onAction?.("next");
            return Clutter.EVENT_STOP;
        });
    }

    setActionHandler(handler: (action: TabletControlAction) => void): void {
        this._onAction = handler;
    }

    setPlaying(playing: boolean): void {
        const icon = this.playPauseBtn.child as St.Icon;
        icon.icon_name = playing
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic";
    }

    applyMode(tabletSetting: number, gameMode: boolean): void {
        if (tabletSetting > 0 && !gameMode) {
            this.show();
            this.prevBtn.visible = tabletSetting === 1 || tabletSetting === 3;
            this.nextBtn.visible = tabletSetting === 1 || tabletSetting === 3;
            this.playPauseBtn.visible = tabletSetting === 2 || tabletSetting === 3;
        } else {
            this.hide();
        }
    }
}
