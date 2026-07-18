import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class WidgetWidthRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const widgetWidthRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 100, upper: 600, step_increment: 10 })
        });
        this.add_suffix(widgetWidthRow);

        settings.style.connect("changed::panel-pill-width", () => {
            widgetWidthRow.set_value(settings.style.panelWidth);
        });
        widgetWidthRow.set_value(settings.style.panelWidth);
    }
}