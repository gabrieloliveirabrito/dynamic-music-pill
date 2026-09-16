import St from "gi://St";
import GObject from "gi://GObject";
import Clutter from "gi://Clutter";
import { CrossfadeArtConstants } from "@/constants";

export class CrossfadeArt extends St.Widget {
    private _radius: number = CrossfadeArtConstants.RADIUS;
    private _shadowCSS: string = "box-shadow: none;";
    private _lastCSS?: string;
    private _currentUrl?: string;
    private _bgUrl?: string;

    static {
        GObject.registerClass(this);
    }

    constructor(properties?: Partial<St.Widget.ConstructorProps>) {
        super(properties ?? {});

        this.layout_manager = new Clutter.BinLayout();
        this.set_style_class_name("art-widget");
        this.set_clip_to_allocation(false);
        this.set_x_expand(false);
        this.set_y_expand(false);
    }

    private _updateContainerStyle() {
        this.setRadius(this._radius);

        let hasArt = !!this._currentUrl && this._currentUrl.length > 0;
        let activeShadow = hasArt ? this._shadowCSS : "box-shadow: none;";
        let bgColor = hasArt ?
            `background-color: ${CrossfadeArtConstants.DEFAULT_COLOR};`
            : "background-color: transparent;";

        this.set_style(`${activeShadow} ${bgColor}`);
    }

    private _refreshLayerStyle(layer: CrossfadeArt) {
        if (!layer || !layer.get_parent()) return;
        let bgCSS = layer._bgUrl ? `background-image: url("${layer._bgUrl}");` : "";

        let radius = this.getRadius();
        let radiusCSS = `border-radius: ${radius}px; background-size: cover; box-shadow: none; `;

        let fullCSS = bgCSS + radiusCSS;
        if (fullCSS === layer._lastCSS) {
            return;
        }

        layer._lastCSS = fullCSS;
        layer.set_style(fullCSS);
    }

    getRadius(): number {
        return isNaN(this._radius) ? CrossfadeArtConstants.RADIUS
            : this._radius;
    }

    setRadius(radius: number) {
        this._radius = isNaN(radius) ? CrossfadeArtConstants.RADIUS : radius;
        this.set_style(`border-radius: ${radius}px; ${this._shadowCSS}`);

        const actors = this.get_children().filter(c => c instanceof CrossfadeArt);
        actors.forEach(c => c._refreshLayerStyle(c));
    }

    setShadowStyle(cssString: string) {
        this._shadowCSS = cssString;
        this._updateContainerStyle();

        const actors = this.get_children().filter(c => c instanceof CrossfadeArt);
        actors.forEach(a => a._refreshLayerStyle(a));
    }

    setArt(newUrl: string, force: boolean = false) {
        if (!newUrl) {
            return;
        }

        let children = this.get_children().filter(c => c instanceof CrossfadeArt && c._bgUrl === newUrl);
        if (children.length > 0 && !force) {
            return;
        }

        this._currentUrl = newUrl;
        this._updateContainerStyle();

        const easeActor = (actor: object) => actor as { ease: Function };

        let newLayer = new CrossfadeArt({
            x_expand: true,
            y_expand: true,
            opacity: 0
        });
        newLayer._bgUrl = newUrl;

        this.add_child(newLayer);
        this._refreshLayerStyle(newLayer);

        easeActor(newLayer).ease({
            opacity: 255,
            duration: 1000,
            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
            onStopped: (isFinished: boolean) => {
                if (!isFinished) return;

                newLayer.opacity = 255;

                let currentChildren = this.get_children();
                let layerIndex = currentChildren.indexOf(newLayer);

                if (layerIndex > 0) {
                    for (let i = 0; i < layerIndex; i++) {
                        let oldLayer = currentChildren[i];

                        easeActor(oldLayer).ease({
                            opacity: 0,
                            duration: 300,
                            mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                            onStopped: () => oldLayer.destroy()
                        });
                    }
                }
            }
        });
    }
}