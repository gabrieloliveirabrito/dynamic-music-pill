import { ActionRowProps } from "@/types/shell-types"
import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import Gio from "gi://Gio"
import { SettingsProvider } from "@/providers/settings-provider"

export class ArtRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const artToggle = new Gtk.Switch({
            active: settings.pill.showAlbumArt,
            valign: Gtk.Align.CENTER
        });
        this.add_suffix(artToggle);

        settings.pill.bind("showAlbumArt", artToggle, "active")
    }
}