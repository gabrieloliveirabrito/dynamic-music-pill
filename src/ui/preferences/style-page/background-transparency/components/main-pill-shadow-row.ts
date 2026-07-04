import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class MainPillShadowRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const mainPillShadowRow = new Gtk.Switch({
            active: settings.pill.enableShadow,
            valign: Gtk.Align.CENTER
        });
        settings.pill.bind('enableShadow', mainPillShadowRow, 'active');
        this.add_suffix(mainPillShadowRow);
    }
}