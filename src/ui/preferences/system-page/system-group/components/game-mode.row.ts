import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class GameModeRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps, ...args: any[]) {
        super(props, args);

        const gameModeSwitch = new Gtk.Switch({
            active: settings.system.gameMode,
            valign: Gtk.Align.CENTER
        })
        settings.system.bind("gameMode", gameModeSwitch, "active");
        this.add_suffix(gameModeSwitch);
    }
}