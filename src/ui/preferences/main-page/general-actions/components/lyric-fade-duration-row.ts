import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps, SpinRowProps } from "@/types/shell-types"

export class LyricFadeDurationRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args)

        var lyricFadeDurationRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 50, upper: 2000, step_increment: 50 })
        })

        settings.lyrics.bind("fadeDuration", lyricFadeDurationRow, "value")
        settings.lyrics.bind("enable", lyricFadeDurationRow, "sensitive")

        this.add_suffix(lyricFadeDurationRow)
    }
}