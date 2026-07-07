import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class CustomWidthRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const customWidthToggle = new Gtk.Switch({
            active: settings.popup.useCustomWidth,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("useCustomWidth", customWidthToggle, "active");
        this.add_suffix(customWidthToggle);
    }
}