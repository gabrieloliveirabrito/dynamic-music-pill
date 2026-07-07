import Gio from "gi://Gio"
import { createSettingsGroup, createSettingsMap, SchemaKey, SettingsGroup } from "./utils";

const map = createSettingsMap({
    artPath: {
        key: "fallback-art-path",
        default: ""
    }
})

export type FallbackArtSettingsType = SettingsGroup<typeof map>
export type FallbackArtSettingsSchema = SchemaKey<typeof map>

export function createFallbackArtsSettings(settings: Gio.Settings) {
    return createSettingsGroup(settings, map);
}