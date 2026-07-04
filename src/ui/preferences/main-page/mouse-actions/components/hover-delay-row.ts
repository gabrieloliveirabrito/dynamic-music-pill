import Adw from "gi://Adw"
import GObject from "gi://GObject"
import { ActionRowProps } from "@/types/shell-types"
import { SettingsProvider } from "@/providers/settings-provider"
import Gtk from "gi://Gtk"

export class HoverDelayRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        var hoverDelayRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 0, upper: 3000, step_increment: 100 })
        })

        settings.mouseActions.bind("hoverDelay", hoverDelayRow, "value")

        this.add_suffix(hoverDelayRow)
    }
}