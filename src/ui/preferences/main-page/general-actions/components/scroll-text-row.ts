import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"
import Adw from "gi://Adw"
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"

export class ScrollTextRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const scrollTextToggle = new Gtk.Switch({
            active: settings.scrollControls.scrollText,
            valign: Gtk.Align.CENTER
        })
        settings.scrollControls.bind("scrollText", scrollTextToggle, "active");
        
        this.add_suffix(scrollTextToggle);
    }
}