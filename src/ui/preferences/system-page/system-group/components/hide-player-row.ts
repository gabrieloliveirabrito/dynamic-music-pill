import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class HidePlayerRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps, ...args: any[]) {
        super(props, args);

        const hidePlayerSwitch = new Gtk.Switch({
            active: settings.system.hideDefaultPlayer,
            valign: Gtk.Align.CENTER
        })
        settings.system.bind("hideDefaultPlayer", hidePlayerSwitch, "active");
        this.add_suffix(hidePlayerSwitch);
    }
}