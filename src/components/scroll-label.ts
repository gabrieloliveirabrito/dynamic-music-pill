import Clutter from "@girs/clutter-18";
import GObject from "@girs/gobject-2.0";
import Pango from "@girs/pango-1.0";
import St from "@girs/st-18";
import { getAppContext } from "@/extension";
import { AppContext } from "@/types/app-context";
import { PixelSnappedBox } from "./pixel-snapped-box";
import { WidgetProps } from "@/types/shell-types";

export class ScrollLabel extends St.Widget {
    private appContext: AppContext;
    private text: string = "";
    private gameMode: boolean = false;
    private playerPaused: boolean = false;
    private paused: boolean = false;
    private isScrolling: boolean = false;
    private hoverOnly: boolean = false;
    private hovered: boolean = false;
    private forceScroll: boolean = false;
    private pendingScrollStop: boolean = false;
    private container: PixelSnappedBox;
    private _label1: St.Label;
    private _label2: St.Label;

    static {
        GObject.registerClass(this)
    }

    constructor(styleClass: string, properties?: WidgetProps, ...args: any[]) {
        super(properties, args);
        this.layoutManager = new Clutter.BinLayout();
        this.set_x_expand(true)
        this.set_y_expand(false);
        this.set_clip_to_allocation(true);

        this.appContext = getAppContext();

        this.hoverOnly = this.appContext.settings.scrollControls.onHoverOnly;
        this.container = new PixelSnappedBox({
            x_expand: true,
            y_expand: true,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER
        })
        this.container.orientation = Clutter.Orientation.HORIZONTAL;
        this.add_child(this.container)

        this._label1 = new St.Label({
            style_class: styleClass,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._label1.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        this._label1.clutter_text.line_wrap = false;

        this._label2 = new St.Label({
            style_class: styleClass,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._label2.clutter_text.ellipsize = Pango.EllipsizeMode.NONE;
        this._label2.clutter_text.line_wrap = false;
    }
}