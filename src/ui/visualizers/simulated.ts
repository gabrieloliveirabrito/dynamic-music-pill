import GObject from "gi://GObject";
import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { SettingsProvider } from "@/providers/settings-provider";
import { Color } from "@/types/color";

/**
 * Faithful port of srcJS/uiVisualizers.js SimulatedVisualizer.
 * Uses scale_y (not set_height) — the reinvented height timer was crashing Mutter.
 */
export class SimulatedVisualizer extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _settings: SettingsProvider;
    private _isPopup: boolean;
    private _bars: St.Widget[] = [];
    private _color = "255,255,255";
    private _mode = 1;
    private _isPlaying = false;
    private _timerId: number | null = null;

    constructor(settings: SettingsProvider, isPopup = false) {
        super({
            style: "spacing: 2px;",
            y_align: Clutter.ActorAlign.FILL,
            x_align: Clutter.ActorAlign.END,
        });
        (this.layout_manager as Clutter.BoxLayout).orientation = Clutter.Orientation.HORIZONTAL;
        this._settings = settings;
        this._isPopup = isPopup;
        this._updateBarCount();
        this.connect("destroy", () => this._cleanup());
    }

    _updateBarCount(): void {
        this.destroy_all_children();
        this._bars = [];
        const count = this._isPopup
            ? (this._settings.popup.popupVisualizerBars || 10)
            : (this._settings.style.visualizerBarCount || 4);
        const barWidth = this._isPopup
            ? (this._settings.popup.popupVisualizerBarWidth || 2)
            : (this._settings.style.visualizerBarWidth || 2);

        for (let i = 0; i < count; i++) {
            const bar = new St.Widget({
                style_class: "visualizer-bar",
                y_expand: true,
                y_align: Clutter.ActorAlign.FILL,
            });
            bar.set_width(barWidth);
            bar.set_pivot_point(0.5, this._mode === 2 ? 0.5 : 1.0);
            this.add_child(bar);
            this._bars.push(bar);
        }
        this._updateBarsCss();
    }

    private _cleanup(): void {
        if (this._timerId !== null) {
            GLib.source_remove(this._timerId);
            this._timerId = null;
        }
    }

    setMode(m: number): void {
        this._mode = m;
        const pivotY = m === 2 ? 0.5 : 1.0;
        for (const bar of this._bars) {
            bar.set_pivot_point(0.5, pivotY);
        }
    }

    setColor(c: Color): void {
        let r = 255, g = 255, b = 255;
        if (c && typeof c.r === "number" && !Number.isNaN(c.r)) r = Math.min(255, c.r + 100);
        if (c && typeof c.g === "number" && !Number.isNaN(c.g)) g = Math.min(255, c.g + 100);
        if (c && typeof c.b === "number" && !Number.isNaN(c.b)) b = Math.min(255, c.b + 100);
        this._color = `${Math.floor(r)},${Math.floor(g)},${Math.floor(b)}`;
        this._updateBarsCss();
        if (!this._isPlaying) {
            this._updateVisuals(0);
        }
    }

    setPlaying(playing: boolean): void {
        if (this._isPlaying === playing) {
            return;
        }
        this._isPlaying = playing;
        this._updateBarsCss();
        if (this._timerId !== null) {
            GLib.source_remove(this._timerId);
            this._timerId = null;
        }

        if (playing && this._mode !== 0) {
            this._timerId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 16, () => {
                if (!this.get_parent()) {
                    this._timerId = null;
                    return GLib.SOURCE_REMOVE;
                }
                if (!this.mapped) {
                    return GLib.SOURCE_CONTINUE;
                }
                const t = Date.now() / 250;
                this._updateVisuals(t);
                return GLib.SOURCE_CONTINUE;
            });
        } else {
            this._updateVisuals(0);
        }
    }

    private _updateBarsCss(): void {
        const opacity = this._isPlaying ? 1.0 : 0.4;
        const barWidth = this._isPopup
            ? (this._settings.popup.popupVisualizerBarWidth || 2)
            : (this._settings.style.visualizerBarWidth || 2);
        const bRad = barWidth >= 4 ? 2 : (barWidth > 1 ? 1 : 0);
        const css = `background-color: rgba(${this._color}, ${opacity}); border-radius: ${bRad}px;`;
        for (const bar of this._bars) {
            bar.set_style(css);
        }
    }

    private _updateVisuals(t: number): void {
        if (!this.get_parent()) {
            return;
        }
        if (!this._isPlaying) {
            for (const bar of this._bars) {
                bar.scale_y = 0.2;
            }
            return;
        }
        const speeds = [1.1, 1.6, 1.3, 1.8, 1.5, 1.2, 1.7, 1.4];
        this._bars.forEach((bar, idx) => {
            let scaleY = 0.2;
            if (this._mode === 1) {
                const wave = (Math.sin(t - idx * 1.0) + 1) / 2;
                scaleY = 0.3 + (wave * 0.7);
            } else if (this._mode === 2) {
                const pulse = (Math.sin(t * speeds[idx % speeds.length]) + 1) / 2;
                scaleY = 0.3 + (pulse * 0.7);
            }
            bar.scale_y = scaleY;
        });
    }

    destroy(): void {
        this._cleanup();
        super.destroy();
    }
}
