import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class AlbumArtSizeRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps) {
        super(props);

        const albumArtSizeRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 16, upper: 48, step_increment: 1 })
        })
        settings.pill.bind("albumArtSize", albumArtSizeRow, "value");
        
        this.add_suffix(albumArtSizeRow);
    }
}