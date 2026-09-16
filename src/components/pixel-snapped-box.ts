import St from "gi://St";
import GObject from "gi://GObject";
import Clutter from "gi://Clutter";

export class PixelSnappedBox extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    vfunc_allocate(box: Clutter.ActorBox): void {
        box.x1 = Math.round(box.x1);
        box.x2 = Math.round(box.x2);
        box.y1 = Math.round(box.y1);
        box.y2 = Math.round(box.y2);

        super.vfunc_allocate(box);
    }
}
