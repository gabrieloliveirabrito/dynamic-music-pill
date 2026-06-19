import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import Gio from "gi://Gio"
import { ActionRowProps } from "@/types/shell-types"

export class ScrollCtrlRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: Gio.Settings, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const scrollCtrlToggle = new Gtk.Switch({
            active: settings.get_boolean("enable-scroll-controls"),
            valign: Gtk.Align.CENTER
        })
        settings.bind('enable-scroll-controls', scrollCtrlToggle, 'active', Gio.SettingsBindFlags.DEFAULT);

        this.add_suffix(scrollCtrlToggle);
    }
}