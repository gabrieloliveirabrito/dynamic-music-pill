import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";

type EaseActor = St.Widget & {
    rotation_angle_z: number;
    ease(props: Record<string, unknown>): void;
};

export class VinylArt extends St.Bin {
    static {
        GObject.registerClass(this);
    }

    private _art: EaseActor;
    private _url: string | null = null;
    private _spinning = false;
    private _square = false;

    constructor() {
        super({
            width: 96,
            height: 96,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._art = new St.Widget({
            width: 96,
            height: 96,
            style: "border-radius: 48px; background-size: cover; background-color: rgba(40,40,40,0.8);",
        }) as EaseActor;
        this.set_child(this._art);
    }

    setSquare(square: boolean): void {
        this._square = square;
        this._refreshStyle();
    }

    setArt(url: string | null): void {
        this._url = url;
        this._refreshStyle();
    }

    setSpinning(spinning: boolean): void {
        if (this._spinning === spinning) {
            return;
        }
        this._spinning = spinning;
        this._art.remove_all_transitions();
        if (spinning) {
            this._art.set_pivot_point(0.5, 0.5);
            this._spinOnce();
        } else {
            this._art.rotation_angle_z = 0;
        }
    }

    private _spinOnce(): void {
        if (!this._spinning) {
            return;
        }
        this._art.ease({
            rotation_angle_z: this._art.rotation_angle_z + 360,
            duration: 8000,
            mode: Clutter.AnimationMode.LINEAR,
            onStopped: (finished: boolean) => {
                if (finished && this._spinning) {
                    this._spinOnce();
                }
            },
        });
    }

    private _refreshStyle(): void {
        const radius = this._square ? 12 : 48;
        const bg = this._url
            ? `background-image: url("${this._url}");`
            : "background-color: rgba(40,40,40,0.8);";
        this._art.set_style(`border-radius: ${radius}px; background-size: cover; ${bg}`);
    }
}
