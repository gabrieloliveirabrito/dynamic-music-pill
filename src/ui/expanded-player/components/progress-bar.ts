import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { formatTime } from "@/utils/time";

export class ProgressBar extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _current: St.Label;
    private _total: St.Label;
    private _fill: St.Widget;
    private _track: St.Widget;
    private _onSeek: ((ratio: number) => void) | null = null;
    private _length = 0;
    private _forceHours = false;

    constructor() {
        super({
            vertical: false,
            x_expand: true,
            style: "spacing: 8px;",
            y_align: Clutter.ActorAlign.CENTER,
        });

        this._current = new St.Label({ text: "0:00", y_align: Clutter.ActorAlign.CENTER });
        this._total = new St.Label({ text: "0:00", y_align: Clutter.ActorAlign.CENTER });

        this._track = new St.Widget({
            style_class: "music-pill-progress-track",
            style: "background-color: rgba(255,255,255,0.2); border-radius: 3px; height: 6px;",
            x_expand: true,
            reactive: true,
            height: 6,
        });
        this._fill = new St.Widget({
            style: "background-color: rgba(255,255,255,0.85); border-radius: 3px; height: 6px;",
            height: 6,
            width: 0,
        });
        this._track.add_child(this._fill);

        this._track.connect("button-release-event", (_a, event) => {
            if (!this._onSeek) {
                return Clutter.EVENT_PROPAGATE;
            }
            const [ex] = event.get_coords();
            const [tx] = this._track.get_transformed_position();
            const w = this._track.get_width() || 1;
            const ratio = Math.max(0, Math.min(1, (ex - tx) / w));
            this._onSeek(ratio);
            return Clutter.EVENT_STOP;
        });

        this.add_child(this._current);
        this.add_child(this._track);
        this.add_child(this._total);
    }

    setSeekHandler(handler: (ratio: number) => void): void {
        this._onSeek = handler;
    }

    setForceHours(force: boolean): void {
        this._forceHours = force;
    }

    update(position: number, length: number): void {
        this._length = length;
        this._current.text = formatTime(position, this._forceHours);
        this._total.text = formatTime(length, this._forceHours);
        const w = this._track.get_width() || 0;
        const ratio = length > 0 ? Math.max(0, Math.min(1, position / length)) : 0;
        this._fill.set_width(Math.floor(w * ratio));
    }
}
