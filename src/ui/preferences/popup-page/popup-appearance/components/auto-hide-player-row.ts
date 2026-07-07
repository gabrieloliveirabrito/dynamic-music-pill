import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class AutoHidePlayerRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const autoHidePlayerToggle = new Gtk.Switch({
            active: settings.popup.autoHidePlayer,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("autoHidePlayer", autoHidePlayerToggle, "active");
        this.add_suffix(autoHidePlayerToggle);
    }
}