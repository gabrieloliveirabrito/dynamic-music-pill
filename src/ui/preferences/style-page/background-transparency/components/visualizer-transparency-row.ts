import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class VisualizerTransparencyRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);
        const visualizerTransparencyRow = new Gtk.Switch({
            active: settings.style.visualizerTransparency,
            valign: Gtk.Align.CENTER
        });
        settings.style.bind('visualizerTransparency', visualizerTransparencyRow, 'active');
        settings.style.bind('enableTransparency', this, 'sensitive');
        this.add_suffix(visualizerTransparencyRow);
    }
}