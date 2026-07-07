import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class CorderRadiusRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
 
    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const corderRadiusRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 0, upper: 50, step_increment: 1 })
        });
        settings.style.bind('corderRadius', corderRadiusRow, 'value');
        this.add_suffix(corderRadiusRow);
    }
}