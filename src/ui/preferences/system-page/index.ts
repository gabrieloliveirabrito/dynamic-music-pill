import Adw from "gi://Adw";
import GObject from "gi://GObject";

import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesPageProps } from "@/types/shell-types";
import { SystemGroup } from "./system-group";
import { t } from "@/utils/translate";
import { MappingHelpGroup } from "./mapping-help";
import { AppMappingGroup } from "./aps-mapping-group";
import { DBusProvider } from "@/providers/dbus-provider";
import { RunningPlayersGroup } from "./running-players-group";
import { BackupGroup } from "./backup-group";

export class SystemPage extends Adw.PreferencesPage {
    static {
        GObject.registerClass(this);
    }

    private _isRefreshingPlayers = false;

    constructor(settings: SettingsProvider, dbusProvider: DBusProvider, properties?: PreferencesPageProps, ...args: any[]) {
        super(properties, args);

        const systemGroup = new SystemGroup(settings, dbusProvider, {
            title: t("System")
        });
        this.add(systemGroup);

        const mappingHelpGroup = new MappingHelpGroup(settings);
        this.add(mappingHelpGroup);

        const appMappingGroup = new AppMappingGroup({
            systemPage: this,
            settings: settings,
            title: t('Saved App Mappings'),
            description: t('Edit the target App ID for manually mapped players, or remove them.')
        });
        this.add(appMappingGroup);

        const activePlayersGroup = new RunningPlayersGroup({
            systemPage: this,
            settings: settings,
            dbusProvider: dbusProvider,
            title: t('Running Players Detection'),
            description: t('Click on a detected player to automatically fill the mapping.')
        });
        this.add(activePlayersGroup);

        const backupGroup = new BackupGroup(settings, {
            title: t('Backup and Restore Settings')
        });
        this.add(backupGroup);
    }

    get isRefreshingPlayers(): boolean {
        return this._isRefreshingPlayers;
    }

    set isRefreshingPlayers(isRefreshing: boolean) {
        this._isRefreshingPlayers = isRefreshing;
    }
}