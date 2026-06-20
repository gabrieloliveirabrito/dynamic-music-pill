import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { gettext as _ } from "@girs/gnome-shell/extensions/prefs"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"

export class ScrollCtrlRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const scrollCtrlToggle = new Gtk.Switch({
            active: settings.scrollControls.enabled,
            valign: Gtk.Align.CENTER
        })

        settings.scrollControls.bind("enabled", scrollCtrlToggle, "active");

        this.add_suffix(scrollCtrlToggle);
    }
}