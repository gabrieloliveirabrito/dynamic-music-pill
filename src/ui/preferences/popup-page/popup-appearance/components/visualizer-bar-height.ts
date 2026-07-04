import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class VisualizerBarHeightRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const popupVisualizerHeightRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 20, upper: 200, step_increment: 5 })
        });
        settings.popup.bind("popupVisualizerHeight", popupVisualizerHeightRow, "value");
        settings.popup.bind("showVisualizer", popupVisualizerHeightRow, "sensitive");
        this.add_suffix(popupVisualizerHeightRow);
    }
}