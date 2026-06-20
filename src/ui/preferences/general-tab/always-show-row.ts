import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import Gio from "gi://Gio"
import Adw from "gi://Adw"
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";


export class AlwaysShowRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const alwaysShowToggle = new Gtk.Switch({
            active: settings.pill.alwaysShow,
            valign: Gtk.Align.CENTER
        });
        this.add_suffix(alwaysShowToggle);

        settings.pill.bind("alwaysShow", alwaysShowToggle, "active");
        this.add_suffix(alwaysShowToggle);
    }
}