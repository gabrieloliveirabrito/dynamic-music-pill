import Adw from "gi://Adw";
import GObject from "gi://GObject"
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import Gtk from "gi://Gtk";

export class PopupRotateRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const popRotateToggle = new Gtk.Switch({
            active: settings.popup.vinylRotate,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("vinylRotate", popRotateToggle, "active");
        this.add_suffix(popRotateToggle);
    }
}