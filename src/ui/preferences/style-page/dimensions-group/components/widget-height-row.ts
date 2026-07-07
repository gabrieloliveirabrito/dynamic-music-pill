import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class WidgetHeightRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps) {
        super(props);

        const dockHeightRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 32, upper: 100, step_increment: 4 })
        })
        settings.pill.bind("dockHeight", dockHeightRow, "value");
        
        this.add_suffix(dockHeightRow);
    }
}