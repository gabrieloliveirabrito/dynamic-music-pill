import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class ManualIndexRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const manualIndexRow = new Adw.SpinRow({ adjustment: new Gtk.Adjustment({ lower: 0, upper: 20, step_increment: 1 }) });
        settings.pill.bind('manualIndex', manualIndexRow, 'value');
        
        this.add_suffix(manualIndexRow);
    }
}