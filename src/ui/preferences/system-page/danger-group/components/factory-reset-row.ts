import Adw from "gi://Adw"
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import { SettingsKeys, SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";
import { t } from "@/utils/translate";

export class FactoryResetRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const resetBtn = new Gtk.Button({
            label: t('Reset All'),
            valign: Gtk.Align.CENTER,
            css_classes: ['destructive-action']
        });

        resetBtn.connect('clicked', () => {
            for(const key of SettingsKeys) {
                settings.gioInternal.reset(key);
            }
        });

        this.add_suffix(resetBtn);
    }
}