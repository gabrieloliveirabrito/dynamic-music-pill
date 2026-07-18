import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import { HidePlayerRow } from "./components/hide-player-row";
import { t } from "@/utils/translate";
import { GameModeRow } from "./components/game-mode.row";
import { CompatibilityDelayRow } from "./components/compatiblity-delay-row";
import { FilterModeRow } from "./components/filter-mode-row";
import { FilteredPlayersRow } from "./components/filtered-players-row";
import { DetectedPlayersRow } from "./components/detected-players-row";
import { MPRISProvider } from "@/providers/mpris-provider";

export class SystemGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, mpris: MPRISProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const hidePlayerRow = new HidePlayerRow(settings, {
            title: t("Hide Default GNOME Player"),
            subtitle: t("Remove the duplicate built-in media controls")
        });
        this.add(hidePlayerRow);

        const gameModeRow = new GameModeRow(settings, {
            title: t('Game Mode'), 
            subtitle: t('Disable animations when a fullscreen app is active')
        });
        this.add(gameModeRow);

        const compatibilityDelayRow = new CompatibilityDelayRow(settings, {
            title: t('Slow Player Workaround'),
            subtitle: t('Adds a slight delay to track changes (fixes sync issues)')
        });
        this.add(compatibilityDelayRow);

        const filterModeRow = new FilterModeRow(settings, {
            title: t('Player Filter Mode'),
            subtitle: t('Choose how to filter media players (e.g. browsers)'),
        });
        this.add(filterModeRow);
        
        const filterListRow = new FilteredPlayersRow(settings, {
            title: t('Filtered Players (comma separated)')
        });
        this.add(filterListRow)

        const detectedPlayersRow = new DetectedPlayersRow(settings, mpris, {
            title: t('Detected Players'),
            subtitle: t('Click an active player to add it to the filter list')
        });
        this.add(detectedPlayersRow);
    }
}