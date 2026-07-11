import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GLib from "gi://GLib"
import GObject from "gi://GObject"
import { SettingsKeys, SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"
import { t } from "@/utils/translate"
import { logError } from "@/utils/log"

export class ImportRow extends Adw.ActionRow {
    static { 
        GObject.registerClass(this);
    }
    constructor(settings: SettingsProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const importBtn = new Gtk.Button({
            label: t('Import'),
            valign: Gtk.Align.CENTER
        });

        importBtn.connect('clicked', () => {
            const dialog = new Gtk.FileDialog({ title: t('Open Settings Backup') });
            dialog.open(null, null, (dlg, res) => {
                if (!dlg) {
                    return;
                }

                try {
                    const file = dlg.open_finish(res);
                    if (file) {
                        const [ok, contents] = file.load_contents(null);
                        if (ok) {
                            const decoder = new TextDecoder();
                            const json = decoder.decode(contents);
                            const data = JSON.parse(json);

                            for (const k of SettingsKeys) {
                                const type = settings.gioInternal.get_default_value(k)?.get_type_string();
                                const value = data[k];
                                if (type && value !== undefined) {
                                    settings.gioInternal.set_value(k, new GLib.Variant(type, value));
                                }
                            }
                        }
                    }
                } catch (error) {
                    logError(error);
                }
            });
        });

        this.add_suffix(importBtn);
    }
}