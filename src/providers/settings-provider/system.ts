import Gio from "gi://Gio";
import { createSettingsMap, createSettingsGroup, SchemaKey, SettingsGroup } from "./utils";

const map = createSettingsMap({
    hideDefaultPlayer: {
        key: 'hide-default-player',
        default: false
    },
    gameMode: {
        key: 'enable-gamemode',
        default: false
    },
    compatibilityDelay: {
        key: 'compatibility-delay',
        default: false
    },
    playerFilterMode: {
        key: "player-filter-mode",
        default: 0
    },
    filteredPlayers: {
        key: "player-filter-list",
        default: ""
    },
    appNameMapping: {
        key: "app-name-mapping",
        default: ""
    }
});

export type SystemSettingsSchema = SchemaKey<typeof map>
export type SystemSettingsType = SettingsGroup<typeof map>

export function createSystemSettings(settings: Gio.Settings): SystemSettingsType {
    return createSettingsGroup(settings, map);
}