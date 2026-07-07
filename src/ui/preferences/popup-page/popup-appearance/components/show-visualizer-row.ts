import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class ShowVisualizerRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const showVisualizerToggle = new Gtk.Switch({
            active: settings.popup.showVisualizer,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("showVisualizer", showVisualizerToggle, "active");
        this.add_suffix(showVisualizerToggle);
    }
}