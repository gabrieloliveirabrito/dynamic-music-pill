import { createSettingsMap, createSettingsGroup, SchemaKey, SettingsGroup, getSettingsKeys } from "./utils";
import Gio from "gi://Gio";

const map = createSettingsMap({
    vinylRotate: {
        key: 'popup-vinyl-rotate',
        default: false
    },
    vinylSpeed: {
        key: 'popup-vinyl-speed',
        default: 10
    },
    enableShadow: {
        key: 'popup-enable-shadow',
        default: true
    },
    hideOnLeave: {
        key: 'popup-hide-on-leave',
        default: false
    },
    followCustomBg: {
        key: 'popup-follow-custom-bg',
        default: false
    },
    useCustomColors: {
        key: 'use-custom-colors',
        default: false
    },
    followCustomText: {
        key: 'popup-follow-custom-text',
        default: false
    },
    followTransparency: {
        key: 'popup-follow-transparency',
        default: false
    },
    followBorderRadius: {
        key: 'popup-follow-radius',
        default: false
    },
    showVinyl: {
        key: 'popup-show-vinyl',
        default: true
    },
    squareVinyl: {
        key: 'popup-vinyl-square',
        default: false
    },
    showShuffle: {
        key: 'show-shuffle-loop',
        default: false
    },
    useCustomWidth: {
        key: 'popup-use-custom-width',
        default: false
    },
    customWidth: {
        key: 'popup-custom-width',
        default: 320
    },
    showPlayerSelector: {
        key: 'popup-show-player-selector',
        default: false
    },
    playerSelectorPosition: {
        key: 'popup-player-selector-position',
        default: 0
    },
    autoHidePlayer: {
        key: 'hide-auto-smart-selection',
        default: false
    },
    showAlbumTitle: {
        key: 'popup-show-album-title',
        default: false
    },
    showHoursFormat: {
        key: 'show-hours-format',
        default: true
    },
    showVisualizer: {
        key: 'popup-show-visualizer',
        default: true
    },
    hidePillVisualizer: {
        key: 'popup-hide-pill-visualizer',
        default: false
    },
    popupVisualizerBars: {
        key: 'popup-visualizer-bars',
        default: 10
    },
    popupVisualizerBarWidth: {
        key: 'popup-visualizer-bar-width',
        default: 10
    },
    popupVisualizerHeight: {
        key: 'popup-visualizer-height',
        default: 100
    },
    enableCustomButtons: {
        key: 'enable-custom-buttons',
        default: false
    },
    customButton1: {
        key: 'custom-button-1',
        default: 'none'
    },
    customButton2: {
        key: 'custom-button-2',
        default: 'none'
    },
});

export type PopupSettingsSchema = SchemaKey<typeof map>
export type PopupSettingsType = SettingsGroup<typeof map>
export const PopupSettingsKeys = getSettingsKeys(map);

export function createPopupSettings(settings: Gio.Settings): PopupSettingsType {
    return createSettingsGroup(settings, map);
}