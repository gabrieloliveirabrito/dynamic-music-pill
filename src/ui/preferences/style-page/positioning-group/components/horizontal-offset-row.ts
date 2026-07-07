import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class HorizontalOffsetRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps) {
        super(props);

        const hOffsetRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: -50, upper: 50, step_increment: 1 })
        })
        settings.pill.bind("horizontalOffset", hOffsetRow, "value");
        
        this.add_suffix(hOffsetRow);
    }
}