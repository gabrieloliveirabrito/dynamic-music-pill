import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { ScrollLabel } from "@/components/scroll-label";

export class TrackInfoBlock extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }

    private _title: ScrollLabel;
    private _artist: ScrollLabel;

    constructor() {
        super({
            vertical: true,
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
            style: "spacing: 4px;",
        });
        this._title = new ScrollLabel("music-label-title");
        this._artist = new ScrollLabel("music-label-artist");
        this.add_child(this._title as unknown as St.Widget);
        this.add_child(this._artist as unknown as St.Widget);
    }

    setTitle(text: string): void {
        this._title.setText(text || "", true, 0);
    }

    setArtist(text: string): void {
        this._artist.setText(text || "", true);
    }

    setPaused(paused: boolean): void {
        this._title.setPlayerPaused(paused);
        this._artist.setPlayerPaused(paused);
    }
}
