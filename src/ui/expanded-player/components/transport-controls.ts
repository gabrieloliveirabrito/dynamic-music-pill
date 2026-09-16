import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { PlaybackStatus } from "@/types/player-types";

export type TransportCallbacks = {
    onPrevious(): void;
    onPlayPause(): void;
    onNext(): void;
};

export class TransportControls extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _prev: St.Button;
    private _play: St.Button;
    private _next: St.Button;
    private _playIcon: St.Icon;

    constructor(callbacks: TransportCallbacks) {
        super({
            vertical: false,
            x_align: Clutter.ActorAlign.CENTER,
            style: "spacing: 12px;",
        });

        this._prev = this._iconButton("media-skip-backward-symbolic", () => callbacks.onPrevious());
        this._playIcon = new St.Icon({ icon_name: "media-playback-start-symbolic", icon_size: 28 });
        this._play = new St.Button({
            child: this._playIcon,
            reactive: true,
            can_focus: true,
            style_class: "music-pill-transport-btn",
        });
        this._play.connect("clicked", () => callbacks.onPlayPause());
        this._next = this._iconButton("media-skip-forward-symbolic", () => callbacks.onNext());

        this.add_child(this._prev);
        this.add_child(this._play);
        this.add_child(this._next);
    }

    setStatus(status: PlaybackStatus): void {
        this._playIcon.icon_name = status === "Playing"
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic";
    }

    setCapabilities(canPrev: boolean, canPlay: boolean, canNext: boolean): void {
        this._prev.opacity = canPrev ? 255 : 80;
        this._play.opacity = canPlay ? 255 : 80;
        this._next.opacity = canNext ? 255 : 80;
        this._prev.reactive = canPrev;
        this._play.reactive = canPlay;
        this._next.reactive = canNext;
    }

    private _iconButton(iconName: string, onClick: () => void): St.Button {
        const btn = new St.Button({
            child: new St.Icon({ icon_name: iconName, icon_size: 22 }),
            reactive: true,
            can_focus: true,
            style_class: "music-pill-transport-btn",
        });
        btn.connect("clicked", onClick);
        return btn;
    }
}
