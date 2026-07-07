import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class TextTransparencyRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const textTransparencyRow = new Gtk.Switch({
            active: settings.style.textTransparency,
            valign: Gtk.Align.CENTER
        });
        settings.style.bind('textTransparency', textTransparencyRow, 'active');
        settings.style.bind('enableTransparency', this, 'sensitive');
        this.add_suffix(textTransparencyRow);
    }
}