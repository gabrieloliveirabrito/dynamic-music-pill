import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio"
import GLib from "gi://GLib";
import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import { t } from "@/utils/translate";
import { SystemPage } from "..";
import { logInfo } from "@/utils/log";

type AppMappingGroupProps = {
    settings: SettingsProvider;
    systemPage: SystemPage;
} & PreferencesGroupProps;

export class AppMappingGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    private rows: Adw.EntryRow[] = [];
    private settings: SettingsProvider;
    private systemPage: SystemPage;
    
    constructor(properties: AppMappingGroupProps, ...args: any[]) {
        const { settings, systemPage, ...props } = properties;
        super(props, args);
        
        this.settings = settings;
        this.systemPage = systemPage;

        this.settings.system.connect("changed::app-name-mapping", () => this.refreshAppMappings());
        this.refreshAppMappings();
    }

    private clearRows() {
        for (const row of this.rows) {
            this.remove(row);
        }
        this.rows = [];
    }

    private refreshAppMappings() {
        const { settings, systemPage } = this;
        if (systemPage.isRefreshingPlayers) {
            return;
        }
        systemPage.isRefreshingPlayers = true;

        this.clearRows();

        const pairs = this.settings.system.appNameMapping.split(",").filter(p => p.trim() !== '');
        if (pairs.length === 0) {
            this.set_description(t("No manual mappings saved."))
            systemPage.isRefreshingPlayers = false;

            return;
        }

        this.set_description(t("Type the correct App ID, then hit Enter or click the Save icon!"));
        for (const pair of pairs) {
            const parts = pair.split(':');
            if (parts.length >= 2) {
                const mprisName = parts[0].trim();
                const targetId = parts.slice(1).join(':').trim();

                const row = new Adw.EntryRow({
                    title: mprisName,
                    text: targetId
                });

                const btnBox = new Gtk.Box({
                    spacing: 6,
                    valign: Gtk.Align.CENTER
                });

                const saveBtn = new Gtk.Button({
                    icon_name: "document-save-symbolic",
                    valign: Gtk.Align.CENTER,
                    css_classes: ['flat', 'suggested-action'],
                    tooltip_text: t("Save App ID")
                })

                const saveAction = () => {
                    const newId = row.text.trim();
                    if (newId === '') return;

                    const currentPairs = settings.system.appNameMapping.split(',').filter(p => p.trim() !== '');
                    const newPairs = currentPairs.map(p => {
                        if (p.startsWith(`${mprisName}:`)) {
                            return `${mprisName}:${newId}`;
                        }

                        return p;
                    });

                    settings.system.appNameMapping = newPairs.join(",");

                    saveBtn.set_icon_name("object-select-symbolic");
                    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1500, () => {
                        if (saveBtn) {
                            saveBtn.set_icon_name('document-save-symbolic');
                        }
                        return GLib.SOURCE_REMOVE;
                    });
                };

                saveBtn.connect("clicked", saveAction);
                row.connect("apply", saveAction);

                const deleteBtn = new Gtk.Button({
                    icon_name: "user-trash-symbolic",
                    valign: Gtk.Align.CENTER,
                    css_classes: ['flat', 'destructive-action'],
                    tooltip_text: t("Delete Mapping")
                });

                deleteBtn.connect("clicked", () => {
                    const currentPairs = settings.system.appNameMapping.split(',').filter(p => p.trim() !== '');
                    const newPairs = currentPairs.filter(p => !p.startsWith(`${mprisName}:`));
                    
                    settings.system.appNameMapping = newPairs.join(",");
                });

                btnBox.append(saveBtn);
                btnBox.append(deleteBtn);
                row.add_suffix(btnBox);

                this.rows.push(row);
                this.add(row);
            }
        }

        systemPage.isRefreshingPlayers = false;
    }
}