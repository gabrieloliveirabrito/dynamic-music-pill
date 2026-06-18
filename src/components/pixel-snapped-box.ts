import Clutter from "@girs/clutter-18"
import { GObject } from "@girs/gobject-2.0/gobject-2.0"
import { St } from "@girs/st-18/st-18"

export const PixelSnappedBox = GObject.registerClass(
    class PixelSnappedBox extends St.BoxLayout {
        vfunc_allocate(box: Clutter.ActorBox): void {
            box.x1 = Math.round(box.x1);
            box.x2 = Math.round(box.x2);
            box.y1 = Math.round(box.y1);
            box.y2 = Math.round(box.y2);

            super.vfunc_allocate(box);
        }
    }
)

