import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class WidgetWidthRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps) {
        super(props);

        const dockWidthRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 100, upper: 600, step_increment: 10 })
        })
        settings.pill.bind("dockWidth", dockWidthRow, "value");
        
        this.add_suffix(dockWidthRow);
    }
}