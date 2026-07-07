import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class VisualizerBarHeightRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const visualizerBarHeightRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 10, upper: 100, step_increment: 2 })
        });
        settings.style.bind('visualizerHeight', visualizerBarHeightRow, 'value');
        this.add_suffix(visualizerBarHeightRow);
    }
}