import Gio from "gi://Gio"
import { createSettingsGroup, createSettingsMap, SchemaKey, SettingsGroup } from "./utils";

const map = createSettingsMap({
    enabled: {
        key: "enable-scroll-controls",
        default: false
    }
})

export type ScrollControlSettingsType = SettingsGroup<typeof map>;
export type ScrollControlSettingsSchema = SchemaKey<typeof map>

export function createScrollControlsSettings(settings: Gio.Settings) {
    return createSettingsGroup(settings, map);
}