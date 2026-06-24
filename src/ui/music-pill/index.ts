import { GObject } from "@girs/gobject-2.0/gobject-2.0"
import { St } from "@girs/st-18/st-18"
import Clutter from "@girs/clutter-18";
import { CrossfadeArt } from "@/components"
import { MusicPillState } from "./state";

export const MusicPill = GObject.registerClass(
    class MusicPill extends St.Widget {
        _state: MusicPillState;
        _body: St.BoxLayout

        constructor() {
            super();
            let f = new CrossfadeArt();
            this._state = {
                lastScrollTime: 0,
                isActive: false,
                targetWidth: 250,
                paddingX: 14,
                paddingY: 6,
                radius: 28,
                shadowCSS: "box-shadow: none",
                inPanel: false,
                gameMode: false,
                currentBusName: null,
                displayedColor: { r: 40, g: 40, b: 40 },
                targetColor: { r: 40, g: 40, b: 40 },
                colorAnimId: null,
                hideGraceTimer: null,
                lastBodyCss: null,
                lastLeftCss: null,
                lastRightCss: null
            };

            //TODO: delegate
            this._body = new St.BoxLayout({
                style_class: "pill-body",
                x_expand: false,
                y_expand: false,
                y_align: Clutter.ActorAlign.CENTER,
            });
            this._body.set_pivot_point(0.5, 0.5);
        }

        _init() {
            super._init({
                style_class: "music-pill-container",
                reactive: false,
                layout_manager: new Clutter.BinLayout(),
                y_expand: true,
                y_align: Clutter.ActorAlign.FILL,
                x_align: Clutter.ActorAlign.CENTER,
                opacity: 0,
                width: 0,
                visible: false
            });
        }
    }
)