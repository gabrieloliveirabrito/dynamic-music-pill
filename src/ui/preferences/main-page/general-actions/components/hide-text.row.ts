import Adw from "gi://Adw"
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"
import { t } from "@/utils/translate"

export class HideTextRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args)

        const hideTextToggle = new Gtk.Switch({
            active: settings.pill.hideText,
            valign: Gtk.Align.CENTER
        })
        settings.pill.bind("hideText", hideTextToggle, "active")

        this.add_suffix(hideTextToggle)
    }
}