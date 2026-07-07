import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class EnableShadowRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const enableShadowRow = new Gtk.Switch({
            active: settings.pill.enableShadow,
            valign: Gtk.Align.CENTER
        });
        settings.pill.bind('enableShadow', enableShadowRow, 'active');
        this.add_suffix(enableShadowRow);
    }
}