import Adw from "gi://Adw";
import GObject from "gi://GObject"
import { PreferencesGroupProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import { PopupRotateRow } from "./components/popup-rotate-row";
import { PopupRotateSpeedRow } from "./components/popup-rotate-speed-row";
import { PopupShadowRow } from "./components/popup-shadow-row";
import { HideOnLeaveRow } from "./components/hide-on-leave-row";
import { CustomBgRow } from "./components/custom-bg-row";
import { CustomTextRow } from "./components/custom-text-row";
import { FollowTransparencyRow } from "./components/follow-transparency-row";
import { FollowBorderRadiusRow } from "./components/follow-border-radius-row";
import { SquareVinylRow } from "./components/square-vinyl-row";
import { ShowVinylRow } from "./components/show-vinyl-row";
import { ShowShuffleRow } from "./components/show-shuffle-row";
import { CustomWidthRow } from "./components/custom-width-row";
import { CustomWidthSpinRow } from "./components/custom-width-spin-row";
import { PlayerSelectorRow } from "./components/player-selector-row";
import { AutoHidePlayerRow } from "./components/auto-hide-player-row";
import { PlayerSelectionPositionRow } from "./components/player-selection-position-row";
import { ShowAlbumRow } from "./components/show-album-row";
import { HoursRow } from "./components/hours-row";
import { ShowVisualizerRow } from "./components/show-visualizer-row";
import { HidePillVisualizerRow } from "./components/hide-pill-visualizer-row";
import { VisualizerBarCountRow } from "./components/visualizer-bar-count";
import { VisualizerBarWidthRow } from "./components/visualizer-bar-width";
import { VisualizerBarHeightRow } from "./components/visualizer-bar-height";

export class PopupAppearance extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const popRotateRow = new PopupRotateRow(settings, {
            title: t("Rotate Vinyl"),
            subtitle: t("Spin the album art when playing")
        });
        this.add(popRotateRow);

        const popRotateSpeedRow = new PopupRotateSpeedRow(settings, {
            title: t("Rotation Speed"),
            subtitle: t("Adjust the vinyl spin speed (Lower is slower, Default: 10)")
        });
        this.add(popRotateSpeedRow);

        const popShadowRow = new PopupShadowRow(settings, {
            title: t("Enable Shadow"),
            subtitle: t("Show drop shadow behind the pop-up menu")
        });
        this.add(popShadowRow);

        const hideOnLeaveRow = new HideOnLeaveRow(settings, {
            title: t("Close on Mouse Leave"),
            subtitle: t("Automatically hide the pop-up when you move the cursor away")
        });
        this.add(hideOnLeaveRow);

        const customBgRow = new CustomBgRow(settings, {
            title: t("Follow Custom Background Color"),
            subtitle: t("Use the custom background color for the pop-up (if active)")
        });
        this.add(customBgRow);

        const customTextRow = new CustomTextRow(settings, {
            title: t("Follow Custom Text Color"),
            subtitle: t("Use the custom text color for the pop-up (if active)")
        });
        this.add(customTextRow);

        const followTransparencyRow = new FollowTransparencyRow(settings, {
            title: t("Follow Transparency"),
            subtitle: t("Inherit opacity settings from the main pill")
        });
        this.add(followTransparencyRow);

        const followBorderRadiusRow = new FollowBorderRadiusRow(settings, {
            title: t("Follow Border Radius"),
            subtitle: t("Inherit corner roundness from the main pill")
        });
        this.add(followBorderRadiusRow);

        const showVinylRow = new ShowVinylRow(settings, {
            title: t("Show Vinyl"),
            subtitle: t("Display the album art in the pop-up")
        });
        this.add(showVinylRow);

        const squareVinylRow = new SquareVinylRow(settings, {
            title: t("Square Vinyl Image"),
            subtitle: t("Use a square album art (disables rotation)")
        });
        this.add(squareVinylRow);

        const showShuffleRow = new ShowShuffleRow(settings, {
            title: t("Show Shuffle and Loop"),
            subtitle: t("Display extra controls in the pop-up")
        });
        this.add(showShuffleRow);

        const customWidthRow = new CustomWidthRow(settings, {
            title: t("Use Custom Width"),
            subtitle: t("Disable dynamic sizing for the pop-up")
        });
        this.add(customWidthRow);

        const customWidthSpinRow = new CustomWidthSpinRow(settings, {
            title: t("Custom Width Value"),
            subtitle: t("Set the custom width for the pop-up")
        });
        this.add(customWidthSpinRow);

        const playerSelectorRow = new PlayerSelectorRow(settings, {
            title: t("Show Player Selector"),
            subtitle: t("Display active player icons in the pop-up")
        });
        this.add(playerSelectorRow);

        const autoHidePlayerRow = new AutoHidePlayerRow(settings, {
            title: t("Hide Auto (Smart Selection)"),
            subtitle: t("Remove the automatic player selection entry from the player selector menu")
        });
        this.add(autoHidePlayerRow);

        const playerSelectionPositionRow = new PlayerSelectionPositionRow(settings, {
            title: t("Player Selector Position"),
            subtitle: t("Where to place the player icons inside the pop-up")
        });
        this.add(playerSelectionPositionRow);

        const showAlbumRow = new ShowAlbumRow(settings, {
            title: t("Show Album Title"),
            subtitle: t("Display album name next to the artist (Artist \u2022 Album)")
        });
        this.add(showAlbumRow);

        const hoursRow = new HoursRow(settings, {
            title: t("Show HH:MM:SS"),
            subtitle: t("Display hours in the time labels when media is longer than 60 minutes")
        });
        this.add(hoursRow);

        const showVisualizerRow = new ShowVisualizerRow(settings, {
            title: t("Show Visualizer in Pop-up"),
            subtitle: t("Display the visualizer in the pop-up")
        });
        this.add(showVisualizerRow);

        const hidePillVisualizerRow = new HidePillVisualizerRow(settings, {
            title: t("Hide Pill Visualizer"),
            subtitle: t("Creates a \"moving\" effect by hiding the main pill visualizer")
        });
        this.add(hidePillVisualizerRow);

        const visualizerBarCountRow = new VisualizerBarCountRow(settings, {
            title: t("Popup Visualizer Bar Count")
        });
        this.add(visualizerBarCountRow);

        const visualizerBarWidthRow = new VisualizerBarWidthRow(settings, {
            title: t("Popup Visualizer Bar Width")
        });
        this.add(visualizerBarWidthRow);

        const visualizerBarHeightRow = new VisualizerBarHeightRow(settings, {
            title: t("Popup Visualizer Height")
        });
        this.add(visualizerBarHeightRow);
    }
}