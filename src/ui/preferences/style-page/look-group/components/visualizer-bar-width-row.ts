import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { ActionRowProps, SpinRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class VisualizeBarWidthRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const visualizerBarWidthRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 1, upper: 10, step_increment: 1 })
        });
        settings.style.bind('visualizerBarWidth', visualizerBarWidthRow, 'value');
        this.add_suffix(visualizerBarWidthRow);
    }
}