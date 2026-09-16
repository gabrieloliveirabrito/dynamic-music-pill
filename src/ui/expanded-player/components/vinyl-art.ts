import GObject from "gi://GObject";
import GLib from "gi://GLib";
import St from "gi://St";
import Clutter from "gi://Clutter";

type EaseActor = St.Widget & {
    rotation_angle_z: number;
    ease(props: Record<string, unknown>): void;
};

/**
 * Vinyl spin uses a single long ease (+36000°) like the legacy player.
 * Never recurse from onStopped — that crashed Mutter with "too much recursion".
 */
export class VinylArt extends St.Bin {
    static {
        GObject.registerClass(this);
    }

    private _art: EaseActor;
    private _url: string | null = null;
    private _spinning = false;
    private _square = false;
    private _speed = 10;
    private _idleId: number | null = null;

    constructor() {
        super({
            width: 96,
            height: 96,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            style_class: "vinyl-container",
        });
        this._art = new St.Widget({
            width: 96,
            height: 96,
            style_class: "vinyl-container",
            style: "border-radius: 48px; background-size: cover; background-color: rgba(40,40,40,0.8);",
        }) as EaseActor;
        this.set_child(this._art);
        this._art.set_pivot_point(0.5, 0.5);
    }

    setSquare(square: boolean): void {
        this._square = square;
        this._refreshStyle();
        if (square && this._spinning) {
            this.setSpinning(false);
        }
    }

    setSpeed(speed: number): void {
        this._speed = Math.max(1, speed || 10);
    }

    setArt(url: string | null): void {
        this._url = url;
        this._refreshStyle();
    }

    setSpinning(spinning: boolean): void {
        if (spinning && this._square) {
            spinning = false;
        }
        if (this._spinning === spinning) {
            return;
        }

        if (spinning) {
            this._spinning = true;
            this._startSpin();
        } else {
            this._stopSpin();
        }
    }

    destroy(): void {
        this._clearIdle();
        this._spinning = false;
        this._art.remove_all_transitions();
        super.destroy();
    }

    private _startSpin(): void {
        this._clearIdle();
        this._art.remove_all_transitions();
        this._art.set_pivot_point(0.5, 0.5);

        const factor = 10 / this._speed;
        const initialDuration = Math.round(800 * factor);
        const loopDuration = Math.round(350000 * factor);
        const currentAngle = this._art.rotation_angle_z || 0;

        this._art.ease({
            rotation_angle_z: currentAngle + 90,
            duration: initialDuration,
            mode: Clutter.AnimationMode.EASE_IN_QUAD,
            onStopped: (finished: boolean) => {
                if (!finished || !this._spinning) {
                    return;
                }
                // Schedule next ease on idle so we never recurse synchronously
                this._idleId = GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
                    this._idleId = null;
                    if (!this._spinning) {
                        return GLib.SOURCE_REMOVE;
                    }
                    const next = this._art.rotation_angle_z || 0;
                    this._art.ease({
                        rotation_angle_z: next + 36000,
                        duration: loopDuration,
                        mode: Clutter.AnimationMode.LINEAR,
                    });
                    return GLib.SOURCE_REMOVE;
                });
            },
        });
    }

    private _stopSpin(): void {
        this._spinning = false;
        this._clearIdle();

        const factor = 10 / this._speed;
        const stopDuration = Math.round(800 * factor);
        const currentAngle = this._art.rotation_angle_z || 0;
        this._art.remove_all_transitions();

        this._art.ease({
            rotation_angle_z: currentAngle + 90,
            duration: stopDuration,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onStopped: (finished: boolean) => {
                if (finished) {
                    this._art.rotation_angle_z = (this._art.rotation_angle_z || 0) % 360;
                }
            },
        });
    }

    private _clearIdle(): void {
        if (this._idleId !== null) {
            GLib.source_remove(this._idleId);
            this._idleId = null;
        }
    }

    private _refreshStyle(): void {
        const radius = this._square ? 12 : 48;
        const klass = this._square ? "vinyl-container-square" : "vinyl-container";
        this._art.set_style_class_name(klass);
        const bg = this._url
            ? `background-image: url("${this._url}");`
            : "background-color: rgba(40,40,40,0.8);";
        this._art.set_style(`border-radius: ${radius}px; background-size: cover; ${bg}`);
    }
}
