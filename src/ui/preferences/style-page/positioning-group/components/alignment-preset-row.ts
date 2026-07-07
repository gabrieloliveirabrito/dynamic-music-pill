import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class AlignmentPresetRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const alignmentPresetRow = new Gtk.StringList();
        alignmentPresetRow.append(t("Manual Index"));
        alignmentPresetRow.append(t("First (Start)"));
        alignmentPresetRow.append(t("Center"));
        alignmentPresetRow.append(t("Last (End)"));
        this.set_model(alignmentPresetRow);

        this.set_selected(settings.pill.alignmentPreset);

        this.connect('notify::selected', () => {
            settings.pill.alignmentPreset = this.selected;
        });
    }
}