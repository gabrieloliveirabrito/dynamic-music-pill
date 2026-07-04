import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class CustomTextRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const customTextToggle = new Gtk.Switch({
            active: settings.popup.followCustomText,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("followCustomText", customTextToggle, "active");
        settings.popup.bind("useCustomColors", customTextToggle, "sensitive");
        this.add_suffix(customTextToggle);
    }
}