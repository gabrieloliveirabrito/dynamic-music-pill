import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import Gio from "gi://Gio"
import GObject from "gi://GObject"
import { SettingsKeys, SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"
import { t } from "@/utils/translate"
import { smartUnpack } from "@/utils/packing"
import { logError } from "@/utils/log"

export class ExportRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const exportBtn = new Gtk.Button({
            label: t('Export'),
            valign: Gtk.Align.CENTER,
            css_classes: ['suggested-action']
        });

        exportBtn.connect('clicked', () => {
            let data = {};
            
            for (const k of SettingsKeys) {
                const value = smartUnpack(settings.gioInternal.get_value(k));
                data = Object.assign(data, { [k]: value });
            }

            const dialog = new Gtk.FileDialog({
                title: t('Save Settings'),
                initial_name: 'music-pill-backup.json'
            });

            dialog.save(null, null, (dlg, res) => {
                if (!dlg) {
                    return;
                }

                try {
                    const file = dlg.save_finish(res);
                    if (file) {
                        const encoder = new TextEncoder();
                        const json = JSON.stringify(data, null, 2);
                        const buffer = encoder.encode(json);

                        file.replace_contents_bytes_async(buffer, null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null, null);
                    }
                } catch (error) {
                    logError(error);
                }
            });
        });

        this.add_suffix(exportBtn);
    }
}