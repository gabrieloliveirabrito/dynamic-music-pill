import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class ArtSizeRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const artSizeRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 14, upper: 32, step_increment: 1 })
        });
        this.add_suffix(artSizeRow);

        settings.style.connect("changed::panel-art-size", () => {
            artSizeRow.set_value(settings.style.panelArtSize);
        });
        artSizeRow.set_value(settings.style.panelArtSize);
    }
}