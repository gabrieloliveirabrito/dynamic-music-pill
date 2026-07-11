import Gio from "gi://Gio"
import { createSettingsGroup, createSettingsMap, getSettingsKeys, SchemaKey, SettingsGroup } from "./utils";

const map = createSettingsMap({
    alwaysShow: {
        key: 'always-show-pill',
        default: false
    },
    showAlbumArt: {
        key: "show-album-art",
        default: true
    },
    tabletMode: {
        key: "tablet-mode",
        default: 0
    },
    controlsPosition: {
        key: "pill-controls-position",
        default: 0
    },
    inlineArtist: {
        key: "inline-artist",
        default: false
    },
    showArtist: {
        key: "show-artist",
        default: true
    },
    hideText: {
        key: "hide-text",
        default: false
    },
    enableShadow: {
        key: "enable-shadow",
        default: false
    },
    shadowOpacity: {
        key: "shadow-opacity",
        default: 50
    },
    shadowBlur: {
        key: "shadow-blur",
        default: 0
    },
    dynamicWidth: {
        key: "pill-dynamic-width",
        default: false
    },
    alignmentPreset: {
        key: "position-mode",
        default: 0
    },
    manualIndex: {
        key: "dock-position",
        default: 0
    },
    verticalOffset: {
        key: "vertical-offset",
        default: 0
    },
    horizontalOffset: {
        key: "horizontal-offset",
        default: 0
    },
    albumArtSize: {
        key: "dock-art-size",
        default: 16
    },
    dockWidth: {
        key: "pill-width",
        default: 100
    },
    dockHeight: {
        key: "pill-height",
        default: 32
    }
})

export type PillSettingsSchema = SchemaKey<typeof map>
export type PillSettingsType = SettingsGroup<typeof map>
export const PillSettingsKeys = getSettingsKeys(map);

export function createPillSettings(settings: Gio.Settings) {
    return createSettingsGroup(settings, map);
}