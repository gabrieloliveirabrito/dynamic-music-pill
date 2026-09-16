import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import { ScrollLabel } from "@/components/scroll-label";

/** Faithful layout of title/artist from srcJS/uiMusicPill.js (_textWrapper/_textBox). */
export class TextBlock extends St.Widget {
    static {
        GObject.registerClass(this);
    }

    readonly titleScroll: ScrollLabel;
    readonly artistScroll: ScrollLabel;
    private _textBox: St.BoxLayout;

    constructor() {
        super({
            layout_manager: new Clutter.BinLayout(),
            x_expand: true,
            y_expand: true,
            clip_to_allocation: true,
            style: "min-width: 10px; margin-right: 4px; margin-left: 2px;",
        });

        this._textBox = new St.BoxLayout({
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER,
            x_align: Clutter.ActorAlign.FILL,
            style: "padding-left: 0px; padding-right: 0px; spacing: 0px;",
        });
        (this._textBox.layout_manager as Clutter.BoxLayout).orientation = Clutter.Orientation.VERTICAL;

        this.titleScroll = new ScrollLabel("music-label-title");
        this.artistScroll = new ScrollLabel("music-label-artist");
        this._textBox.add_child(this.titleScroll as unknown as St.Widget);
        this._textBox.add_child(this.artistScroll as unknown as St.Widget);
        this.add_child(this._textBox);
    }

    setTitle(text: string): void {
        this.titleScroll.setText(text ?? "", true, 0);
    }

    setArtist(text: string): void {
        this.artistScroll.setText(text ?? "", true);
    }

    setPlayerPaused(paused: boolean): void {
        this.titleScroll.setPlayerPaused(paused);
        this.artistScroll.setPlayerPaused(paused);
    }

    setLabelStyles(titleCss: string, artistCss: string): void {
        this.titleScroll.setLabelStyle(titleCss);
        this.artistScroll.setLabelStyle(artistCss);
    }

    setArtistVisible(visible: boolean): void {
        this.artistScroll.visible = visible;
    }

    setTextOpacity(opacity: number): void {
        this._textBox.set_opacity(opacity);
    }
}
