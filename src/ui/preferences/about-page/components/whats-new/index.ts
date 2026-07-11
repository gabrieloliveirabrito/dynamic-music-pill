import { PreferencesGroupProps } from "@/types/shell-types";
import Adw from "gi://Adw"
import Gio from "gi://Gio"
import Gtk from "gi://Gtk"
import GLib from "gi://GLib"
import GObject from "gi://GObject"
import * as Shell from "@girs/gnome-shell"
import { logError } from "@/utils/log"

type ChangelogSection = {
    title: string;
    items: string[];
}

type ChangelogType = {
    version: string;
    subtitle: string;
    expanded: boolean;
    sections: ChangelogSection[];
}


export class WhatsNewGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(private extensionDir: Gio.File, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        try {
            const extensionDirPath = extensionDir.get_path();
            if (!extensionDirPath) {
                return
            }

            const changelogPath = GLib.build_filenamev([extensionDirPath, 'changelog.json']);
            const changelogFile = Gio.File.new_for_path(changelogPath);
            if (!changelogFile.query_exists(null)) {
                return;
            }

            const [ok, changelogContent] = changelogFile.load_contents(null);
            if (!ok || changelogContent.length === 0) {
                return;
            }

            const decoder = new TextDecoder();
            const changelogContentString = decoder.decode(changelogContent);
            const changelog = JSON.parse(changelogContentString) as ChangelogType[];

            for (const release of changelog) {
                const row = new Adw.ExpanderRow({
                    title: release.version,
                    subtitle: release.subtitle,
                    expanded: release.expanded,
                });

                for (const section of release.sections) {
                    const sectionRow = new Adw.ExpanderRow({
                        title: section.title,
                        margin_top: 10,
                        margin_bottom: 10,
                        margin_start: 15,
                        margin_end: 15,
                    });

                    for (const item of section.items) {
                        const itemRow = new Gtk.Label({
                            label: `• ${item}`,
                            justify: Gtk.Justification.LEFT,
                            xalign: 0,
                            margin_top: 5,
                            wrap: true,
                        });
                        sectionRow.add_row(itemRow);
                    }
                    row.add_row(sectionRow);
                }

                this.add(row);
            }
        }
        catch (error) {
            logError(error);
        }
    }
}