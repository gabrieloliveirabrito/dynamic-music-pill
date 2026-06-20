import Gio from "gi://Gio"
import { createScrollControlsSettings, ScrollControlSettingsSchema, ScrollControlSettingsType } from "./scroll-controls"
import { createFallbackArtsSettings, FallbackArtSettingsSchema, FallbackArtSettingsType } from "./fallback-art"
import { createPillSettings, PillSettingsSchema, PillSettingsType } from "./pill"

export type SettingsProvider = {
    connect: <K extends keyof Gio.Settings.SignalSignatures>(signal: K, callback: Gio.Settings.SignalSignatures[K]) => number,
    scrollControls: ScrollControlSettingsType,
    fallbackArt: FallbackArtSettingsType,
    pill: PillSettingsType
}

export function createSettingsProvider(settings: Gio.Settings): SettingsProvider {
    const scrollControls = createScrollControlsSettings(settings);
    const fallbackArt = createFallbackArtsSettings(settings);
    const pill = createPillSettings(settings);

    function connect<K extends keyof Gio.Settings.SignalSignatures>(signal: K, callback: Gio.Settings.SignalSignatures[K]): number {
        return settings.connect(signal, callback);
    }

    return {
        connect,
        scrollControls,
        fallbackArt,
        pill
    }
}

export type AllSchemas = ScrollControlSettingsSchema |
    FallbackArtSettingsSchema |
    PillSettingsSchema;