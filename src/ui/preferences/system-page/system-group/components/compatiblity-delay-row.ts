import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class CompatibilityDelayRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps, ...args: any[]) {
        super(props, args);

        const compatibilityDelaySwitch = new Gtk.Switch({
            active: settings.system.compatibilityDelay,
            valign: Gtk.Align.CENTER
        })
        settings.system.bind("compatibilityDelay", compatibilityDelaySwitch, "active");
        this.add_suffix(compatibilityDelaySwitch);
    }
}