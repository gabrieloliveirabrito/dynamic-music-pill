import St from "gi://St";
import GObject from "gi://GObject";
import Clutter from "gi://Clutter";

type Easeable = { ease(props: Record<string, unknown>): void };
type ArtLayer = St.Widget & { _bgUrl?: string; _lastCss?: string };

/**
 * Faithful port of srcJS/uiWidgets.js CrossfadeArt.
 * Layers are plain St.Widget (not nested CrossfadeArt).
 */
export class CrossfadeArt extends St.Widget {
    static {
        GObject.registerClass(this);
    }

    private _radius = 10;
    private _shadowCSS = "box-shadow: none;";
    private _currentUrl?: string;

    constructor(properties?: Partial<St.Widget.ConstructorProps>) {
        super({
            layout_manager: new Clutter.BinLayout(),
            style_class: "art-widget",
            clip_to_allocation: false,
            x_expand: false,
            y_expand: false,
            ...properties,
        });
    }

    setRadius(r: number): void {
        this._radius = typeof r === "number" && !Number.isNaN(r) ? r : 10;
        this._updateContainerStyle();
        for (const c of this.get_children()) {
            this._refreshLayerStyle(c as ArtLayer);
        }
    }

    setShadowStyle(cssString: string): void {
        this._shadowCSS = cssString || "box-shadow: none;";
        this._updateContainerStyle();
        for (const c of this.get_children()) {
            this._refreshLayerStyle(c as ArtLayer);
        }
    }

    private _updateContainerStyle(): void {
        const safeR = typeof this._radius === "number" && !Number.isNaN(this._radius) ? this._radius : 10;
        const hasArt = !!(this._currentUrl && this._currentUrl.length > 0);
        const activeShadow = hasArt ? this._shadowCSS : "box-shadow: none;";
        const bgColor = hasArt ? "background-color: #000000;" : "background-color: transparent;";
        this.set_style(`border-radius: ${safeR}px; ${bgColor} ${activeShadow}`);
    }

    private _refreshLayerStyle(layer: ArtLayer): void {
        if (!layer || !layer.get_parent()) {
            return;
        }
        const url = layer._bgUrl;
        const bgPart = url ? `background-image: url("${url}");` : "";
        const safeR = typeof this._radius === "number" && !Number.isNaN(this._radius) ? this._radius : 10;
        const newCss = `border-radius: ${safeR}px; background-size: cover; box-shadow: none; ${bgPart}`;
        if (layer._lastCss === newCss) {
            return;
        }
        layer._lastCss = newCss;
        if (layer.get_parent()) {
            layer.set_style(newCss);
        }
    }

    setArt(newUrl: string | null, _force = false): void {
        const children = this.get_children() as ArtLayer[];
        if (children.length > 0 && children[children.length - 1]._bgUrl === newUrl) {
            return;
        }

        this._currentUrl = newUrl ?? undefined;
        this._updateContainerStyle();

        for (const c of this.get_children()) {
            c.remove_all_transitions();
        }

        const newLayer = new St.Widget({
            x_expand: true,
            y_expand: true,
            opacity: 0,
        }) as ArtLayer;
        newLayer._bgUrl = newUrl ?? undefined;

        this.add_child(newLayer);
        this._refreshLayerStyle(newLayer);

        (newLayer as unknown as Easeable).ease({
            opacity: 255,
            duration: 1800,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onStopped: (isFinished: boolean) => {
                if (!isFinished) {
                    return;
                }
                newLayer.opacity = 255;
                const currentChildren = this.get_children();
                const myIndex = currentChildren.indexOf(newLayer);
                if (myIndex > 0) {
                    for (let i = 0; i < myIndex; i++) {
                        const oldLayer = currentChildren[i];
                        (oldLayer as unknown as Easeable).ease({
                            opacity: 0,
                            duration: 300,
                            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                            onStopped: () => oldLayer.destroy(),
                        });
                    }
                }
            },
        });
    }
}
