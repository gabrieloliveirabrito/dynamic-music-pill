import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class VisualizerBarWidthRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const popupVisualizerBarWidthRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 1, upper: 20, step_increment: 1 })
        });
        settings.popup.bind("popupVisualizerBarWidth", popupVisualizerBarWidthRow, "value");
        settings.popup.bind("showVisualizer", popupVisualizerBarWidthRow, "sensitive");
        this.add_suffix(popupVisualizerBarWidthRow);
    }
}