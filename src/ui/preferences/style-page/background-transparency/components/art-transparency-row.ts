import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class ArtTransparencyRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const artTransparencyRow = new Gtk.Switch({
            active: settings.style.artTransparency,
            valign: Gtk.Align.CENTER
        });
        settings.style.bind('artTransparency', artTransparencyRow, 'active');
        settings.style.bind('enableTransparency', this, 'sensitive');
        this.add_suffix(artTransparencyRow);
    }
}