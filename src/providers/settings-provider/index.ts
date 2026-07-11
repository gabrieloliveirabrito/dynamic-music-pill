import Gio from "gi://Gio"
import { createScrollControlsSettings, ScrollControlSettingsKeys, ScrollControlSettingsSchema, ScrollControlSettingsType } from "./scroll-controls"
import { createFallbackArtsSettings, FallbackArtSettingsKeys, FallbackArtSettingsSchema, FallbackArtSettingsType } from "./fallback-art"
import { createPillSettings, PillSettingsKeys, PillSettingsSchema, PillSettingsType } from "./pill"
import { createLyricsSettings, LyricsSettingsKeys, LyricsSettingsSchema, LyricsSettingsType } from "./lyrics"
import { createMouseActions, MouseActionsKeys, MouseActionsSchema, MouseActionsType } from "./mouse-actions"
import { createPopupSettings, PopupSettingsKeys, PopupSettingsSchema, PopupSettingsType } from "./popup"
import { createStyleSettings, StyleSettingsKeys, StyleSettingsSchema, StyleSettingsType } from "./style"
import { createSystemSettings, SystemSettingsKeys, SystemSettingsSchema, SystemSettingsType } from "./system"

export type SettingsSchema = ScrollControlSettingsSchema
| FallbackArtSettingsSchema
| PillSettingsSchema
| LyricsSettingsSchema
| MouseActionsSchema
| PopupSettingsSchema
| StyleSettingsSchema
| SystemSettingsSchema

export const SettingsKeys = [
    ...ScrollControlSettingsKeys,
    ...FallbackArtSettingsKeys,
    ...PillSettingsKeys,
    ...LyricsSettingsKeys,
    ...MouseActionsKeys,
    ...PopupSettingsKeys,
    ...StyleSettingsKeys,
    ...SystemSettingsKeys
]

export type SettingsProvider = {
    gioInternal: Gio.Settings,
    connect: <K extends keyof Gio.Settings.SignalSignatures>(signal: K, callback: Gio.Settings.SignalSignatures[K]) => number,
    emit: <K extends keyof Gio.Settings.SignalSignatures>(signal: K, ...args: any) => void,
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

    function emit<K extends keyof Gio.Settings.SignalSignatures>(signal: K, ...args: any): void {
        settings.emit(signal, ...args);
    }

    return {
        gioInternal: settings,
        connect,
        emit,
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