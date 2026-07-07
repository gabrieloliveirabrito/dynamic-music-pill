import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class LyricsRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args)

        const lyricsToggle = new Gtk.Switch({
            active: settings.lyrics.enable,
            valign: Gtk.Align.CENTER
        })
        settings.lyrics.bind("enable", lyricsToggle, "active");

        this.add_suffix(lyricsToggle)
    }
}