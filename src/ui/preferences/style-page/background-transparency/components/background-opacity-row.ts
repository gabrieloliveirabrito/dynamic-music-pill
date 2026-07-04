import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class BackgroundOpacityRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const backgroundOpacityRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 0, upper: 100, step_increment: 5 })
        });
        settings.style.bind('transparencyStrength', backgroundOpacityRow, 'value');
        settings.style.bind('enableTransparency', this, 'sensitive');
        this.add_suffix(backgroundOpacityRow);
    }
}