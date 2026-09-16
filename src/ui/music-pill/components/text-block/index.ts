import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { ScrollLabel } from "@/components/scroll-label";

export class TextBlock extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _titleScroll: ScrollLabel;
    private _artistScroll: ScrollLabel;

    constructor() {
        super({
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
            vertical: true,
        });

        this._titleScroll = new ScrollLabel("music-label-title");
        this._artistScroll = new ScrollLabel("music-label-artist");

        this.add_child(this._titleScroll as unknown as St.Widget);
        this.add_child(this._artistScroll as unknown as St.Widget);
    }

    setTitle(text: string): void {
        this._titleScroll.setText(text ?? "", true, 0);
    }

    setArtist(text: string): void {
        this._artistScroll.setText(text ?? "", true);
    }

    setPlayerPaused(paused: boolean): void {
        this._titleScroll.setPlayerPaused(paused);
        this._artistScroll.setPlayerPaused(paused);
    }
}
