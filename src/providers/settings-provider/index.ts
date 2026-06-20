import Gio from "gi://Gio"
import { createScrollControlsSettings, ScrollControlSettingsSchema, ScrollControlSettingsType } from "./scroll-controls"
import { createFallbackArtsSettings, FallbackArtSettingsSchema, FallbackArtSettingsType } from "./fallback-art"
import { createPillSettings, PillSettingsSchema, PillSettingsType } from "./pill"

export type SettingsProvider = {
    scrollControls: ScrollControlSettingsType,
    fallbackArt: FallbackArtSettingsType,
    pill: PillSettingsType
}

export function createSettingsProvider(settings: Gio.Settings): SettingsProvider {
    const scrollControls = createScrollControlsSettings(settings);
    const fallbackArt = createFallbackArtsSettings(settings);
    const pill = createPillSettings(settings);

    return {
        scrollControls,
        fallbackArt,
        pill
    }
}

export type AllSchemas = ScrollControlSettingsSchema |
    FallbackArtSettingsSchema |
    PillSettingsSchema;