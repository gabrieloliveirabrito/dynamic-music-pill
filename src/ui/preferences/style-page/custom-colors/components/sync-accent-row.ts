import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class SyncAccentRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps, ...args: any[]) {
        super(props, args);

        const syncAccentRow = new Gtk.Switch({
            active: settings.style.syncAccentColor,
            valign: Gtk.Align.CENTER
        })
        settings.style.bind("syncAccentColor", syncAccentRow, "active");
        this.add_suffix(syncAccentRow);
    }
}