import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class WidgetHeightRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const widgetHeightRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 20, upper: 60, step_increment: 2 })
        });
        this.add_suffix(widgetHeightRow);

        settings.style.connect("changed::panel-pill-height", () => {
            widgetHeightRow.set_value(settings.style.panelHeight);
        });
        widgetHeightRow.set_value(settings.style.panelHeight);
    }
}