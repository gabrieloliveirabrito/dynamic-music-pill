import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class HoursRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const hoursToggle = new Gtk.Switch({
            active: settings.popup.showHoursFormat,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("showHoursFormat", hoursToggle, "active");
        this.add_suffix(hoursToggle);
    }
}