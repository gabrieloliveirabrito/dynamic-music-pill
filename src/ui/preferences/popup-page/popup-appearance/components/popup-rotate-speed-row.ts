import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class PopupRotateSpeedRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const popRotateSpeedRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 1, upper: 50, step_increment: 1 })
        });
        settings.popup.bind("vinylSpeed", popRotateSpeedRow, "value");
        settings.popup.bind("vinylRotate", popRotateSpeedRow, "sensitive");
        
        this.add_suffix(popRotateSpeedRow);
    }
}