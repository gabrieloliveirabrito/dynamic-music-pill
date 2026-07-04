import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class ShadowBlurRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const shadowBlurRow = new Adw.SpinRow({
            adjustment: new Gtk.Adjustment({ lower: 0, upper: 50, step_increment: 1 })
        });
        settings.pill.bind('shadowBlur', shadowBlurRow, 'value');
        this.add_suffix(shadowBlurRow);
    }
}