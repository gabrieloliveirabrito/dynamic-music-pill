import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class FollowTransparencyRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const followTransparencyToggle = new Gtk.Switch({
            active: settings.popup.followTransparency,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("followTransparency", followTransparencyToggle, "active");
        this.add_suffix(followTransparencyToggle);
    }
}