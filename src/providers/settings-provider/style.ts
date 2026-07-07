import Gio from "gi://Gio";
import { createSettingsGroup, createSettingsMap, SchemaKey, SettingsGroup } from "./utils";

const map = createSettingsMap({
    visualizerAnimation: {
        key: 'visualizer-style',
        default: 0
    },
    visualizerBarCount: {
        key: 'visualizer-bars',
        default: 10
    },
    visualizerBarWidth: {
        key: 'visualizer-bar-width',
        default: 10
    },
    visualizerHeight: {
        key: 'visualizer-height',
        default: 100
    },
    visualizerMargin: {
        key: 'visualizer-padding',
        default: 10
    },
    outerEdgeMargin: {
        key: 'edge-margin',
        default: 10
    },
    corderRadius: {
        key: 'border-radius',
        default: 0
    },
    showPillOutline: {
        key: 'show-pill-border',
        default: false
    },
    enableTransparency: {
        key: 'enable-transparency',
        default: false
    },
    transparencyStrength: {
        key: 'transparency-strength',
        default: 50
    },
    artTransparency: {
        key: 'transparency-art',
        default: false
    },
    textTransparency: {
        key: 'transparency-text',
        default: false
    },
    visualizerTransparency: {
        key: 'transparency-vis',
        default: false
    },
    targetContainer: {
        key: 'target-container',
        default: 0
    },
});

export type StyleSettingsSchema = SchemaKey<typeof map>
export type StyleSettingsType = SettingsGroup<typeof map>

export function createStyleSettings(settings: Gio.Settings): StyleSettingsType {
    return createSettingsGroup(settings, map);
}