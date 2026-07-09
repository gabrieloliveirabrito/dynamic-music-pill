import Gio from "gi://Gio"
import { createScrollControlsSettings, ScrollControlSettingsSchema, ScrollControlSettingsType } from "./scroll-controls"
import { createFallbackArtsSettings, FallbackArtSettingsSchema, FallbackArtSettingsType } from "./fallback-art"
import { createPillSettings, PillSettingsSchema, PillSettingsType } from "./pill"
import { createLyricsSettings, LyricsSettingsType } from "./lyrics"
import { createMouseActions, MouseActionsType } from "./mouse-actions"
import { createPopupSettings, PopupSettingsType } from "./popup"
import { createStyleSettings, StyleSettingsSchema, StyleSettingsType } from "./style"
import { createSystemSettings, SystemSettingsType } from "./system"

export type SettingsProvider = {
    connect: <K extends keyof Gio.Settings.SignalSignatures>(signal: K, callback: Gio.Settings.SignalSignatures[K]) => number,
    scrollControls: ScrollControlSettingsType,
    fallbackArt: FallbackArtSettingsType,
    pill: PillSettingsType,
    lyrics: LyricsSettingsType,
    mouseActions: MouseActionsType,
    popup: PopupSettingsType,
    style: StyleSettingsType,
    system: SystemSettingsType
}

export function createSettingsProvider(settings: Gio.Settings): SettingsProvider {
    const scrollControls = createScrollControlsSettings(settings);
    const fallbackArt = createFallbackArtsSettings(settings);
    const pill = createPillSettings(settings);
    const lyrics = createLyricsSettings(settings);
    const mouseActions = createMouseActions(settings);
    const popup = createPopupSettings(settings);
    const style = createStyleSettings(settings);
    const system = createSystemSettings(settings);

    function connect<K extends keyof Gio.Settings.SignalSignatures>(signal: K, callback: Gio.Settings.SignalSignatures[K]): number {
        return settings.connect(signal, callback);
    }

    return {
        connect,
        scrollControls,
        fallbackArt,
        pill,
        lyrics,
        mouseActions,
        popup,
        style,
        system
    }
}

export type AllSchemas = ScrollControlSettingsSchema |
    FallbackArtSettingsSchema |
    PillSettingsSchema;