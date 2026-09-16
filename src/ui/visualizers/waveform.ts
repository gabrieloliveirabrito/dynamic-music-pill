import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { SettingsProvider } from "@/providers/settings-provider";
import { Color } from "@/types/color";
import { SimulatedVisualizer } from "./simulated";

/** Waveform facade — modes 0 off / 1 wave / 2 pulse (cava deferred). */
export class WaveformVisualizer extends St.Bin {
    static {
        GObject.registerClass(this);
    }

    private _settings: SettingsProvider;
    private _isPopup: boolean;
    private _simulated: SimulatedVisualizer;
    private _mode = 1;
    private _playing = false;
    private _maxHeight: number | null = null;

    constructor(defaultHeight = 24, settings: SettingsProvider, isPopup = false) {
        super({
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.END,
            y_expand: true,
            height: defaultHeight,
        });
        this._settings = settings;
        this._isPopup = isPopup;
        this._simulated = new SimulatedVisualizer(settings, isPopup);
        this.set_child(this._simulated as unknown as St.Widget);
        this._updateSize();
    }

    setHeightClamped(maxH: number): void {
        this._maxHeight = maxH;
        this._updateSize();
    }

    setMode(mode: number): void {
        // cava (3) falls back to pulse until engine is ported
        this._mode = mode === 3 ? 2 : mode;
        this._simulated.setMode(this._mode);
        this._simulated.setPlaying(this._playing);
        this.visible = this._mode !== 0;
    }

    setColor(c: Color): void {
        this._simulated.setColor(c);
    }

    setPlaying(playing: boolean): void {
        this._playing = playing;
        this._simulated.setPlaying(playing);
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
        this._simulated.updateBarCount();
    }
}
