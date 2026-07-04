import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"

export class InlineArtistRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args)

        const inlineArtistToggle = new Gtk.Switch({
            active: settings.pill.inlineArtist,
            valign: Gtk.Align.CENTER
        })
        settings.pill.bind("inlineArtist", inlineArtistToggle, "active");

        settings.pill.connect("changed::show-artist", () => {
            this.sensitive = settings.pill.showArtist;
        });

        this.add_suffix(inlineArtistToggle);
    }
}