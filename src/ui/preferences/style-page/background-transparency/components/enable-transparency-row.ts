import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class EnableTransparencyRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const enableTransparencyRow = new Gtk.Switch({
            active: settings.style.enableTransparency,
            valign: Gtk.Align.CENTER
        });
        settings.style.bind('enableTransparency', enableTransparencyRow, 'active');
        this.add_suffix(enableTransparencyRow);
    }
}