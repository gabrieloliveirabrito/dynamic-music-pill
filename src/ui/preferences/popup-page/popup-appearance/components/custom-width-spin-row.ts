import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class CustomWidthSpinRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const customWidthSpinRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 260, upper: 800, step_increment: 10 })
        });
        settings.popup.bind("customWidth", customWidthSpinRow, "value");
        settings.popup.bind("useCustomWidth", customWidthSpinRow, "sensitive");

        const updateWidthBound = () => {
            let limit = settings.popup.showShuffle ? 360 : 260;
            customWidthSpinRow.adjustment.lower = limit;

            if (settings.popup.customWidth < limit) {
                settings.popup.customWidth = limit;
            }
        };
        settings.popup.connect("changed::show-shuffle-loop", updateWidthBound);
        updateWidthBound();

        this.add_suffix(customWidthSpinRow);
    }
}