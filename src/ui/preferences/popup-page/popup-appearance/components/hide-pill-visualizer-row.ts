import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class HidePillVisualizerRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const hidePillVisualizerToggle = new Gtk.Switch({
            active: settings.popup.hidePillVisualizer,
            valign: Gtk.Align.CENTER
        });
        settings.popup.bind("hidePillVisualizer", hidePillVisualizerToggle, "active");
        this.add_suffix(hidePillVisualizerToggle);

        settings.popup.bind("showVisualizer", this, "sensitive");
    }
}