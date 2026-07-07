import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class ShadowIntensityRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const shadowIntensityRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 0, upper: 100, step_increment: 5 })
        });
        settings.pill.bind('shadowOpacity', shadowIntensityRow, 'value');
        this.add_suffix(shadowIntensityRow);
        settings.pill.bind("enableShadow", this, "sensitive");
    }
}