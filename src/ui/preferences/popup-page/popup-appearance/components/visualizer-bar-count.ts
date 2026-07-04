import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class VisualizerBarCountRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const popupVisualizerBarsRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 2, upper: 64, step_increment: 1 })
        });
        settings.popup.bind("popupVisualizerBars", popupVisualizerBarsRow, "value");
        settings.popup.bind("showVisualizer", popupVisualizerBarsRow, "sensitive");
        
        this.add_suffix(popupVisualizerBarsRow);
    }
}