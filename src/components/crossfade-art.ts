import { CrossfadeArtConstants } from "@/constants";
import Clutter from "@girs/clutter-18/clutter-18"
import { GObject } from "@girs/gobject-2.0"
import { St } from "@girs/st-18/st-18"

export const CrossfadeArt = GObject.registerClass(
    class CrossfadeArt extends St.Widget {
        private _radius: number;
        private _shadowCSS: string;
        private _lastCSS?: string;
        private _currentUrl?: string;
        private _bgUrl?: string;

        constructor(properties?: ConstructorParameters<typeof St.Widget>[0], ...args: any[]) {
            super(properties, args);

            this.layoutManager = new Clutter.BinLayout();
            this.set_layout_manager(this.layoutManager);

            this._radius = CrossfadeArtConstants.RADIUS;
            this._shadowCSS = "box-shadow: none;";
        }

        _init() {
            super._init();

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
            let layerParent = layer.get_parent();
            if (!layerParent) {
                return;
            }

            let bgCSS = layer._bgUrl ? `background-image: ("${layer._bgUrl}");` : '';

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
            this._radius = isNaN(radius) ? CrossfadeArtConstants.RADIUS  : radius;
            this.set_style(`border-radius: ${radius}px; ${this._shadowCSS}`);
        }

        setShadowStyle(cssString: string) {
            this._shadowCSS = cssString;
            this._updateContainerStyle();

            let actors = this.get_children();
            actors.forEach(a => a instanceof CrossfadeArt && a._refreshLayerStyle(a));
        }

        setArt(newUrl: string, force: boolean = false) {
            let children = this.get_children();
            if (children.length > 0 && children.find(c => c instanceof CrossfadeArt && c._bgUrl === newUrl)) {
                return;
            }

            children.forEach(c => c.remove_all_transitions());

            let newLayer: CrossfadeArt = new CrossfadeArt({
                x_expand: true,
                y_expand: true,
                opacity: 0
            });
            newLayer._bgUrl = newUrl;

            this.add_child(newLayer);
            this._refreshLayerStyle(newLayer);

            newLayer.ease({
                opacity: CrossfadeArtConstants.EASE_OPACITY,
                duration: CrossfadeArtConstants.EASE_DURATION,
                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                onStopped: (isFinished) => {
                    if (!isFinished) {
                        return;
                    }

                    newLayer.opacity = CrossfadeArtConstants.EASE_OPACITY;

                    let currentChildren = this.get_children();
                    let myIndex = currentChildren.indexOf(newLayer);

                    if (myIndex > 0) {
                        for (let i = 0; i < myIndex; i++) {
                            let oldLayer = currentChildren[i];

                            oldLayer.ease({
                                opacity: 0,
                                duration: CrossfadeArtConstants.EASE_OUT_DURATION,
                                mode: Clutter.AnimationMode.EASE_OUT_QUAD,
                                onStopped: (_) => oldLayer.destroy()
                            })
                        }
                    }
                }
            })
        }
    }
)