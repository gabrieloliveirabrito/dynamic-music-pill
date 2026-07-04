import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class CustomBgRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const customBgToggle = new Gtk.Switch({
            active: settings.popup.followCustomBg,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("followCustomBg", customBgToggle, "active");
        settings.popup.bind("useCustomColors", customBgToggle, "sensitive");
        this.add_suffix(customBgToggle);
    }
}