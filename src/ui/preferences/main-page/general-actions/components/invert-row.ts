import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"

export class InvertRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const invertToggle = new Gtk.Switch({
            active: settings.scrollControls.invert,
            valign: Gtk.Align.CENTER
        });
        this.add_suffix(invertToggle);

        settings.scrollControls.bind("invert", invertToggle, "active");

        this.add_suffix(invertToggle);
    }
}