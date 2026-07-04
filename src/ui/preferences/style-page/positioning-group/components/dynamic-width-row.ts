import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class DynamicWidthRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const dynamicWidthRow = new Gtk.Switch({
            active: settings.pill.dynamicWidth,
            valign: Gtk.Align.CENTER
        });
        settings.pill.bind('dynamicWidth', dynamicWidthRow, 'active');
        this.add_suffix(dynamicWidthRow);
    }
}