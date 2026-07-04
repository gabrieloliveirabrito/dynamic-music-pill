import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"

export class LyricFadeRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args)

        const lyricFadeToggle = new Gtk.Switch({
            active: settings.lyrics.fade,
            valign: Gtk.Align.CENTER
        })
        settings.lyrics.bind("fade", lyricFadeToggle, "active")
        settings.lyrics.bind("enable", this, "sensitive")

        this.add_suffix(lyricFadeToggle)
    }
}