import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"

export class ScrollHoverRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const scrollHoverToggle = new Gtk.Switch({
            active: settings.scrollControls.onHoverOnly,
            valign: Gtk.Align.CENTER
        })
        settings.scrollControls.bind("onHoverOnly", scrollHoverToggle, "active");
        settings.scrollControls.bind("scrollText", this, "sensitive")

        this.add_suffix(scrollHoverToggle);
    }
}