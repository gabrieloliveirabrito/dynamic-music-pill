import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class ShowArtistRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args)

        const showArtistToggle = new Gtk.Switch({
            active: settings.pill.showArtist,
            valign: Gtk.Align.CENTER
        });
        settings.pill.bind("showArtist", this, "active");

        this.add_suffix(showArtistToggle);
    }
}