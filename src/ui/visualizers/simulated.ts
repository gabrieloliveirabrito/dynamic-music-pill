import GObject from "gi://GObject";
import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { SettingsProvider } from "@/providers/settings-provider";
import { Color } from "@/types/color";

export class SimulatedVisualizer extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _settings: SettingsProvider;
    private _isPopup: boolean;
    private _bars: St.Widget[] = [];
    private _timer: number | null = null;
    private _playing = false;
    private _mode = 1;
    private _color: Color = { r: 255, g: 255, b: 255 };

    constructor(settings: SettingsProvider, isPopup = false) {
        super({
            style: "spacing: 2px;",
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.END,
        });
        this._settings = settings;
        this._isPopup = isPopup;
        this._rebuildBars();
    }

    setMode(mode: number): void {
        this._mode = mode;
        this.visible = mode !== 0;
        if (mode === 0) {
            this.setPlaying(false);
        }
    }

    setColor(c: Color): void {
        this._color = c;
        this._applyBarStyles();
    }

    setPlaying(playing: boolean): void {
        this._playing = playing && this._mode !== 0;
        if (this._playing) {
            this._start();
        } else {
            this._stop();
            for (const bar of this._bars) {
                bar.set_height(2);
            }
        }
    }

    updateBarCount(): void {
        this._rebuildBars();
    }

    private _barCount(): number {
        return this._isPopup
            ? (this._settings.popup.popupVisualizerBars || 10)
            : (this._settings.style.visualizerBarCount || 10);
    }

    private _barWidth(): number {
        return this._isPopup
            ? (this._settings.popup.popupVisualizerBarWidth || 2)
            : (this._settings.style.visualizerBarWidth || 2);
    }

    private _rebuildBars(): void {
        this.destroy_all_children();
        this._bars = [];
        const count = this._barCount();
        const width = this._barWidth();
        for (let i = 0; i < count; i++) {
            const bar = new St.Widget({
                width,
                height: 2,
                style: `background-color: rgb(${this._color.r},${this._color.g},${this._color.b}); border-radius: 2px;`,
            });
            this._bars.push(bar);
            this.add_child(bar);
        }
    }

    private _applyBarStyles(): void {
        for (const bar of this._bars) {
            bar.set_style(`background-color: rgb(${this._color.r},${this._color.g},${this._color.b}); border-radius: 2px;`);
        }
    }

    private _start(): void {
        if (this._timer !== null) {
            return;
        }
        this._timer = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 50, () => {
            if (!this._playing) {
                this._timer = null;
                return GLib.SOURCE_REMOVE;
            }
            const maxH = Math.max(8, this.get_height() || 24);
            for (const bar of this._bars) {
                const h = this._mode === 2
                    ? Math.max(2, Math.floor(maxH * (0.3 + Math.random() * 0.7)))
                    : Math.max(2, Math.floor(maxH * Math.random()));
                bar.set_height(h);
            }
            return GLib.SOURCE_CONTINUE;
        });
    }

    private _stop(): void {
        if (this._timer !== null) {
            GLib.source_remove(this._timer);
            this._timer = null;
        }
    }

    destroy(): void {
        this._stop();
        super.destroy();
    }
}
