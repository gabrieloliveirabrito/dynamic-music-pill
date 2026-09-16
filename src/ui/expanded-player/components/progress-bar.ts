import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { formatTime } from "@/utils/time";

/**
 * Faithful progress row from srcJS/uiExpandedPlayer.js
 * (progress-container / progress-time / progress-slider-*).
 * Only mutates labels/fill when values actually change — avoids layout flicker.
 */
export class ProgressBar extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _current: St.Label;
    private _total: St.Label;
    private _fill: St.Widget;
    private _track: St.Widget;
    private _onSeek: ((ratio: number) => void) | null = null;
    private _forceHours = false;
    private _lastCurrentText = "";
    private _lastTotalText = "";
    private _lastFillW = -1;

    constructor() {
        super({
            style_class: "progress-container",
            vertical: false,
            y_align: Clutter.ActorAlign.CENTER,
            x_expand: true,
        });

        this._current = new St.Label({
            style_class: "progress-time",
            text: "0:00",
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.START,
            style: "text-align: left; margin-right: 0px;",
        });
        this._total = new St.Label({
            style_class: "progress-time",
            text: "0:00",
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.END,
            style: "text-align: right;",
        });

        this._track = new St.Widget({
            style_class: "progress-slider-bg",
            x_expand: true,
            reactive: true,
            y_align: Clutter.ActorAlign.CENTER,
            style: "margin: 0; padding: 0;",
        });
        this._fill = new St.Widget({ style_class: "progress-slider-fill" });
        this._fill.set_position(0, 0);
        this._track.add_child(this._fill);

        this._track.connect("button-release-event", (_a, event) => {
            if (!this._onSeek || event.get_button() === 8) {
                return Clutter.EVENT_PROPAGATE;
            }
            this._handleSeek(event as unknown as Clutter.Event);
            return Clutter.EVENT_STOP;
        });
        this._track.connect("touch-event", (_a, event) => {
            if (event.type() === Clutter.EventType.TOUCH_END && this._onSeek) {
                this._handleSeek(event as unknown as Clutter.Event);
                return Clutter.EVENT_STOP;
            }
            return Clutter.EVENT_PROPAGATE;
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

    /** Immediate UI after seek (optimistic), matching legacy _handleSeek. */
    applySeekPreview(positionUs: number, lengthUs: number): void {
        const useHours = lengthUs >= 3600000000 && this._forceHours;
        this._setCurrentText(formatTime(positionUs, useHours));
        this._setTotalText(formatTime(lengthUs, useHours));
        const totalW = Math.round(this._track.get_width());
        if (totalW > 0 && lengthUs > 0) {
            const percent = Math.min(1, Math.max(0, positionUs / lengthUs));
            this._setFillWidth(Math.max(6, Math.min(totalW, Math.round(totalW * percent))));
        }
    }

    update(positionUs: number, lengthUs: number, stale = false): void {
        if (lengthUs <= 0) {
            return;
        }

        const useHours = lengthUs >= 3600000000 && this._forceHours;
        const currentText = stale ? "--:--" : formatTime(positionUs, useHours);
        const totalText = stale ? "--:--" : formatTime(lengthUs, useHours);

        this._setCurrentText(currentText);
        this._setTotalText(totalText);

        if (stale) {
            return;
        }

        const percent = Math.min(1, Math.max(0, positionUs / lengthUs));
        const totalW = Math.round(this._track.get_width());
        if (totalW > 0) {
            const targetWidth = Math.max(6, Math.min(totalW, Math.round(totalW * percent)));
            this._setFillWidth(targetWidth);
        }
    }

    private _setCurrentText(text: string): void {
        if (this._lastCurrentText === text) {
            return;
        }
        this._lastCurrentText = text;
        this._current.text = text;
        this._current.set_width(-1);
        const [, natW] = this._current.get_preferred_width(-1);
        this._current.set_width(Math.ceil(natW) + 2);
    }

    private _setTotalText(text: string): void {
        if (this._lastTotalText === text) {
            return;
        }
        this._lastTotalText = text;
        this._total.text = text;
        this._total.set_width(-1);
        const [, natW] = this._total.get_preferred_width(-1);
        this._total.set_width(Math.ceil(natW) + 2);
    }

    private _setFillWidth(w: number): void {
        if (Math.abs(this._lastFillW - w) < 1) {
            return;
        }
        this._lastFillW = w;
        this._fill.width = w;
    }

    private _handleSeek(event: Clutter.Event): void {
        if (!this._onSeek) {
            return;
        }
        const [x] = event.get_coords();
        const [ok, relX] = this._track.transform_stage_point(x, 0);
        if (!ok) {
            return;
        }
        const width = this._track.get_width();
        if (width <= 0) {
            return;
        }
        const ratio = Math.min(1, Math.max(0, relX / width));
        this._onSeek(ratio);
    }
}
