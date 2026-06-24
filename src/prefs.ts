import { ExtensionPreferences } from "@girs/gnome-shell/extensions/prefs"
import Adw from "gi://Adw";
import { GeneralTab } from "./ui/preferences";
import { createSettingsProvider } from "./providers/settings-provider";


const PREFS_KEYS = [
    'scroll-text', 'scroll-on-hover-only', 'freeze-scroll-on-pause', 'show-album-art', 'enable-shadow', 'hide-default-player',
    'shadow-blur', 'shadow-opacity', 'pill-width', 'panel-pill-width',
    'pill-height', 'panel-pill-height', 'vertical-offset', 'horizontal-offset',
    'position-mode', 'dock-position', 'target-container', 'enable-gamemode',
    'visualizer-style', 'border-radius', 'enable-transparency', 'transparency-strength',
    'transparency-art', 'transparency-text', 'transparency-vis', 'invert-scroll-animation',
    'enable-scroll-controls', 'action-left-click', 'action-middle-click',
    'action-right-click', 'action-double-click', 'dock-art-size', 'panel-art-size',
    'popup-enable-shadow', 'popup-follow-transparency', 'popup-follow-radius',
    'popup-vinyl-rotate', 'visualizer-padding', 'scroll-action', 'popup-vinyl-square',
    'popup-show-vinyl', 'show-shuffle-loop', 'use-custom-colors', 'custom-bg-color',
    'custom-text-color', 'tablet-mode', 'pill-controls-position', 'inline-artist', 'show-artist', 'pill-dynamic-width',
    'popup-use-custom-width', 'popup-custom-width', 'player-filter-mode', 'player-filter-list', 'hide-text',
    'fallback-art-path', 'popup-show-visualizer', 'popup-hide-pill-visualizer', 'compatibility-delay',
    'popup-follow-custom-bg', 'popup-follow-custom-text', 'action-hover', 'hover-delay', 'selected-player-bus',
    'popup-show-player-selector', 'hide-auto-smart-selection', 'popup-player-selector-position', 'show-pill-border', 'invert-scroll-direction', 'always-show-pill', 'popup-hide-on-leave',
    'visualizer-bars', 'enable-lyrics', 'app-name-mapping', 'lyric-fade-enable', 'lyric-fade-duration', 'visualizer-bar-width', 'visualizer-height',
    'popup-visualizer-bars', 'popup-visualizer-bar-width', 'popup-visualizer-height', 'edge-margin', 'popup-vinyl-speed', 'sync-accent-color',
    'enable-custom-buttons', 'custom-button-1', 'custom-button-2', 'playback-history',
    'show-hours-format', 'popup-show-album-title'
];

export default class DynamicMusicPillPrefs extends ExtensionPreferences {
    async fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
        window.search_enabled = true;
        pkg.initGettext();

        const settings = this.getSettings();
        const settingsProvider = createSettingsProvider(settings);

        let mainPage = new GeneralTab(settingsProvider, {
            title: _('Main Pill'),
            icon_name: 'preferences-system-symbolic'
        });
        window.add(mainPage);
    }
}