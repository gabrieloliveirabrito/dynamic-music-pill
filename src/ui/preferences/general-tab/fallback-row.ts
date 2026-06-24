import Adw from "gi://Adw";
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import Gio from "gi://Gio"

import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";

export class FallbackRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const fallbackBtn = new Gtk.Button({
            icon_name: "document-open-symbolic",
            valign: Gtk.Align.CENTER,
            css_classes: ['center']
        })

        fallbackBtn.connect('clicked', () => {
            let dialog = new Gtk.FileDialog({
                title: _('Select Fallback Image')
            });

            let filter = new Gtk.FileFilter({
                name: 'Images',
                mime_types: ['image/png', 'image/jpeg']
            })

            let filterList = new Gio.ListStore({
                itemType: Gtk.FileFilter
            })
            filterList.append(filter);
            dialog.set_filters(filterList);

            try {
                dialog.open(null, null, (dlg, res) => {
                    let file = dlg?.open_finish(res);

                    if (file) {
                        let path = file.get_path();

                        if (path) {
                            settings.fallbackArt.artPath = path;

                            this.subtitle = path;
                        }
                    }
                });
            }
            catch (e) {
                logError(e);
            }
        });

        const clearFallbackBtn = new Gtk.Button({
            icon_name: "edit-clear-symbolic",
            valign: Gtk.Align.CENTER,
            css_classes: ['flat', 'error']
        })

        clearFallbackBtn.connect("clicked", () => {
            settings.fallbackArt.artPath = '';

            this.subtitle = _("No image selected");
        })

        const btnBox = new Gtk.Box({
            spacing: 6,
            valign: Gtk.Align.CENTER
        })
        btnBox.append(fallbackBtn);
        btnBox.append(clearFallbackBtn);
        this.add_suffix(btnBox);

        settings.pill.bind("showAlbumArt", this, "sensitive");
    }
}