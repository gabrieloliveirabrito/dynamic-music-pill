import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import Gio from "gi://Gio"
import Adw from "gi://Adw"
import { ActionRowProps } from "@/types/shell-types";


export class AlwaysShowRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: Gio.Settings, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const alwaysShowToggle = new Gtk.Switch({
            active: settings.get_boolean('always-show-pill'),
            valign: Gtk.Align.CENTER
        });
        this.add_suffix(alwaysShowToggle);

        settings.bind('always-show-pill', alwaysShowToggle, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.add_suffix(alwaysShowToggle);
    }
}