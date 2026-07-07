import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class PillOutlineRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const pillOutlineRow = new Gtk.Switch({
            active: settings.style.showPillOutline,
            valign: Gtk.Align.CENTER
        });
        settings.style.bind('showPillOutline', pillOutlineRow, 'active');
        this.add_suffix(pillOutlineRow);
    }
}