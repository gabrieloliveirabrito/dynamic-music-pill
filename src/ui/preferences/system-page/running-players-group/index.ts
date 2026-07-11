import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import Gio from "gi://Gio"
import GLib from "gi://GLib";
import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import { t } from "@/utils/translate";
import { DBusProvider } from "@/providers/dbus-provider";
import { PLAYER_INTERFACE } from "@/constants/mpris-constants";
import { SystemPage } from "..";
import { logInfo } from "@/utils/log";

type RunningPlayersGroupProps = {
    settings: SettingsProvider;
    dbusProvider: DBusProvider;
    systemPage: SystemPage;
} & PreferencesGroupProps;

export class RunningPlayersGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    private settings: SettingsProvider;
    private dbusProvider: DBusProvider;
    private systemPage: SystemPage;
    private rows: Adw.ActionRow[] = [];

    constructor(properties: RunningPlayersGroupProps, ...args: any[]) {
        const { settings, dbusProvider, systemPage, ...props } = properties;
        super(props, args);

        this.settings = settings;
        this.dbusProvider = dbusProvider;
        this.systemPage = systemPage;

        const refreshMappingRow = new Adw.ActionRow({
            title: t('Refresh List'),
            subtitle: t('Click to scan for active players again')
        });

        const refreshMappingBtn = new Gtk.Button({
            icon_name: 'view-refresh-symbolic',
            valign: Gtk.Align.CENTER,
            css_classes: ['flat']
        });

        refreshMappingBtn.connect('clicked', () => this.refreshPlayers());
        refreshMappingRow.add_suffix(refreshMappingBtn);
        this.add(refreshMappingRow);

        settings.system.connect("changed::app-name-mapping", () => this.refreshPlayers());

        this.refreshPlayers();
    }

    private clearRows() {
        for (const row of this.rows) {
            this.remove(row);
        }
        this.rows = [];
    }

    private refreshPlayers() {
        if (this.systemPage.isRefreshingPlayers) {
            return;
        }
        this.systemPage.isRefreshingPlayers = true;

        this.clearRows();

        const currentAppMapping = this.settings.system.appNameMapping;
        const names = this.dbusProvider.listNames();
        const mprisNames = names.filter(n => n.startsWith(`${PLAYER_INTERFACE}.`));

        if (mprisNames.length === 0) {
            this.set_description(t("No active players detected. Open a music app first!"))
        } else {
            this.set_description(t("Select a player to help the extension identify it:"));

            for (const fullBusName of mprisNames) {
                let shortName = fullBusName.replace(`${PLAYER_INTERFACE}.`, '');
                if (shortName.includes(".instance")) {
                    shortName = shortName.split('.instance')[0];
                }

                const row = new Adw.ActionRow({
                    title: shortName,
                    subtitle: `Bus: ${fullBusName}`
                });

                const btn = new Gtk.Button({
                    label: t("Use This"),
                    css_classes: ['suggested-action'],
                    valign: Gtk.Align.CENTER,
                    sensitive: !currentAppMapping.includes(`${shortName}:`)
                })

                btn.connect("clicked", () => {
                    if (currentAppMapping.includes(`${shortName}:`)) {
                        return;
                    }

                    const newVal = currentAppMapping ?
                        `${currentAppMapping},${shortName}:ENTER_APP_ID_HERE` :
                        `${shortName}:ENTER_APP_ID_HERE`;

                    this.settings.system.appNameMapping = newVal;
                })

                this.rows.push(row);
                row.add_suffix(btn);
                this.add(row);
            }
        }

        this.systemPage.isRefreshingPlayers = false;
    }
}