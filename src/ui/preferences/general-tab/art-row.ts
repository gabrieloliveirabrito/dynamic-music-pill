import { ActionRowProps } from "@/types/shell-types"
import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import Gio from "gi://Gio"

export class ArtRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: Gio.Settings, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const artToggle = new Gtk.Switch({
            active: settings.get_boolean('show-album-art'),
            valign: Gtk.Align.CENTER
        });
        this.add_suffix(artToggle);

        settings.bind('show-album-art', artToggle, 'active', Gio.SettingsBindFlags.DEFAULT);
    }
}