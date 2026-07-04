import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class InvertDirRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, props: ActionRowProps, ...args: any[]) {
        super(props, args);

        const invertDirToggle = new Gtk.Switch({
            active: settings.scrollControls.invertScrollDirection,
            valign: Gtk.Align.CENTER
        })

        settings.scrollControls.bind("invertScrollDirection", invertDirToggle, "active");
        this.add_suffix(invertDirToggle);
    }
}