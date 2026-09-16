import GObject from "gi://GObject";
import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { gettext as _ } from "resource:///org/gnome/shell/extensions/extension.js";
import { SettingsProvider } from "@/providers/settings-provider";
import { Color } from "@/types/color";
import { SimulatedVisualizer } from "./simulated";

/**
 * Faithful port of srcJS/uiVisualizers.js WaveformVisualizer.
 * Cava (mode 3) falls back to pulse until visualizerEngine is ported.
 */
export class WaveformVisualizer extends St.Bin {
    static {
        GObject.registerClass(this);
    }

    private _settings: SettingsProvider;
    private _isPopup: boolean;
    private _simulated: SimulatedVisualizer;
    private _mode = 1;
    private _isPlaying = false;
    private _maxHeight: number | null = null;
    private _lastColor: Color | null = null;

    constructor(defaultHeight = 24, settings: SettingsProvider, isPopup = false) {
        super({
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.END,
            y_expand: true,
        });
        this._settings = settings;
        this._isPopup = isPopup;
        this._simulated = new SimulatedVisualizer(settings, isPopup);
        this.set_child(this._simulated as unknown as St.Widget);

        if (this._isPopup) {
            this._settings.popup.connect("changed::popup-visualizer-bars", () => this._updateSize());
            this._settings.popup.connect("changed::popup-visualizer-bar-width", () => this._updateSize());
            this._settings.popup.connect("changed::popup-visualizer-height", () => this._updateSize());
        } else {
            this._settings.style.connect("changed::visualizer-bars", () => this._updateSize());
            this._settings.style.connect("changed::visualizer-bar-width", () => this._updateSize());
            this._settings.style.connect("changed::visualizer-height", () => this._updateSize());
        }

        this._updateSize();
        void defaultHeight;
    }

    private _updateSize(): void {
        let h = this._isPopup
            ? (this._settings.popup.popupVisualizerHeight || 80)
            : (this._settings.style.visualizerHeight || 24);
        if (this._maxHeight && !this._isPopup) {
            h = Math.min(h, this._maxHeight);
        }

        this.set_height(h);
        this._simulated.set_height(h);
        this._simulated._updateBarCount();
    }

    setHeightClamped(maxH: number): void {
        this._maxHeight = maxH;
        this._updateSize();
    }

    setMode(m: number): void {
        if (m === 3 && !GLib.find_program_in_path("cava")) {
            Main.notify("Dynamic Music Pill", _("Please install \"cava\" for real-time mode."));
            m = 2;
        }
        // Cava engine not ported yet — fall back to pulse
        if (m === 3) {
            m = 2;
        }

        this._mode = m;
        this._simulated.setMode(m);
        this._simulated.setPlaying(this._isPlaying);
    }

    setColor(c: Color): void {
        this._lastColor = c;
        this._simulated.setColor(c);
    }

    setPlaying(playing: boolean): void {
        this._isPlaying = playing;
        this._simulated.setPlaying(playing);
    }
}
