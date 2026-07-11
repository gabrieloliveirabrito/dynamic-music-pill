import Gio from "gi://Gio"
import { createSettingsMap, createSettingsGroup, SchemaKey, SettingsGroup, getSettingsKeys } from "./utils";

const map = createSettingsMap({
    enable: {
        key: "enable-lyrics",
        default: false
    },
    preferedLanguage: {
        key: "lyrics-language-preference",
        default: 0
    },
    fade: {
        key: "lyric-fade-enable",
        default: false
    },
    fadeDuration: {
        key: "lyric-fade-duration",
        default: 50
    }
})

export type LyricsSettingsType = SettingsGroup<typeof map>;
export type LyricsSettingsSchema = SchemaKey<typeof map>
export const LyricsSettingsKeys = getSettingsKeys(map);

export function createLyricsSettings(settings: Gio.Settings) {
    return createSettingsGroup(settings, map);
}