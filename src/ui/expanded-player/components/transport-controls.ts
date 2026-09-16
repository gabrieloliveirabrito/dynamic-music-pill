import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { PlaybackStatus } from "@/types/player-types";

export type TransportCallbacks = {
    onPrevious(): void;
    onPlayPause(): void;
    onNext(): void;
};

/** Faithful control row buttons (style_class: control-btn). */
export class TransportControls extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _prev: St.Button;
    private _play: St.Button;
    private _next: St.Button;
    private _playIcon: St.Icon;
    private _lastStatus: PlaybackStatus | null = null;

    constructor(callbacks: TransportCallbacks) {
        super({
            style_class: "controls-row",
            vertical: false,
            x_align: Clutter.ActorAlign.CENTER,
            reactive: true,
        });

        this._prev = this._iconButton("media-skip-backward-symbolic", 24, () => callbacks.onPrevious());
        this._playIcon = new St.Icon({ icon_name: "media-playback-start-symbolic", icon_size: 24 });
        this._play = new St.Button({
            style_class: "control-btn",
            child: this._playIcon,
            reactive: true,
            can_focus: true,
        });
        // Claim press (like tablet / legacy _addBtnPressAnim) so release/clicked isn't stolen by backdrop
        this._play.connect("button-press-event", () => Clutter.EVENT_STOP);
        this._play.connect("clicked", () => {
            callbacks.onPlayPause();
        });
        this._play.connect("touch-event", (_a, event) => {
            if (event.type() === Clutter.EventType.TOUCH_END) {
                callbacks.onPlayPause();
                return Clutter.EVENT_STOP;
            }
            if (event.type() === Clutter.EventType.TOUCH_BEGIN) {
                return Clutter.EVENT_STOP;
            }
            return Clutter.EVENT_PROPAGATE;
        });
        this._next = this._iconButton("media-skip-forward-symbolic", 24, () => callbacks.onNext());

        this.add_child(this._prev);
        this.add_child(this._play);
        this.add_child(this._next);
    }

    setStatus(status: PlaybackStatus): void {
        if (this._lastStatus === status) {
            return;
        }
        this._lastStatus = status;
        this._playIcon.icon_name = status === "Playing"
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic";
    }

    setCapabilities(canPrev: boolean, _canPlay: boolean, canNext: boolean): void {
        // Legacy never disables the play/pause button via CanPlay — only prev/next.
        this._prev.opacity = canPrev ? 255 : 80;
        this._next.opacity = canNext ? 255 : 80;
        this._prev.reactive = canPrev;
        this._next.reactive = canNext;
        this._play.reactive = true;
        this._play.opacity = 255;
    }

    private _iconButton(iconName: string, size: number, onClick: () => void): St.Button {
        const btn = new St.Button({
            style_class: "control-btn",
            child: new St.Icon({ icon_name: iconName, icon_size: size }),
            reactive: true,
            can_focus: true,
        });
        btn.connect("button-press-event", () => Clutter.EVENT_STOP);
        btn.connect("clicked", () => onClick());
        btn.connect("touch-event", (_a, event) => {
            if (event.type() === Clutter.EventType.TOUCH_END) {
                onClick();
                return Clutter.EVENT_STOP;
            }
            if (event.type() === Clutter.EventType.TOUCH_BEGIN) {
                return Clutter.EVENT_STOP;
            }
            return Clutter.EVENT_PROPAGATE;
        });
        return btn;
    }
}
