import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class UseCustomColorsRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps, ...args: any[]) {
        super(props, args);

        const useCustomColorsRow = new Gtk.Switch({
            active: settings.style.useCustomColors,
            valign: Gtk.Align.CENTER
        })
        settings.style.bind("useCustomColors", useCustomColorsRow, "active");
        settings.style.bind("syncAccentColor", this, "sensitive", Gio.SettingsBindFlags.DEFAULT | Gio.SettingsBindFlags.INVERT_BOOLEAN);

        this.add_suffix(useCustomColorsRow);
    }
}