import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class VerticalOffsetRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps) {
        super(props);

        const vOffsetRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: -30, upper: 30, step_increment: 1 })
        })
        settings.pill.bind("verticalOffset", vOffsetRow, "value");

        this.add_suffix(vOffsetRow);
    }
}