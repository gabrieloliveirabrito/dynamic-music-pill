import Gio from "gi://Gio"
import { createSettingsGroup, createSettingsMap, SchemaKey, SettingsGroup } from "./utils";

const map = createSettingsMap({
    alwaysShow: {
        key: 'always-show-pill',
        default: false
    },
    showAlbumArt: {
        key: "show-album-art",
        default: true
    }
})

export type PillSettingsSchema = SchemaKey<typeof map>
export type PillSettingsType = SettingsGroup<typeof map>

export function createPillSettings(settings: Gio.Settings) {
    return createSettingsGroup(settings, map);
}