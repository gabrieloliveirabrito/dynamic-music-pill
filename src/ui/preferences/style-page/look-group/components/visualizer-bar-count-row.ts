import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class VisualizeBarCountRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const visualizerBarRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 2, upper: 32, step_increment: 1 })
        });

        this.add_suffix(visualizerBarRow);

        visualizerBarRow.value = settings.style.visualizerBarCount;
        visualizerBarRow.connect('notify::selected', () => {
            settings.style.visualizerBarCount = visualizerBarRow.value;
        });
    }
}