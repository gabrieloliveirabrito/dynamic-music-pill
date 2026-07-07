import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { PreferencesPageProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { LookGroup } from "./look-group";
import { t } from "@/utils/translate";
import { BackgroundTransparencyGroup } from "./background-transparency";
import { ShadowGroup } from "./shadow-group";
import { PositioningGroup } from "./positioning-group";
import { DimensionsGroup } from "./dimensions-group";
import { CustomColorsGroup } from "./custom-colors";

export class StylePage extends Adw.PreferencesPage {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: PreferencesPageProps, ...args: any[]) {
        super(properties, args);

        const lookGroup = new LookGroup(settings, {
            title: t("Visualizer and Shape")
        });
        this.add(lookGroup);

        const backgroundTransparencyGroup = new BackgroundTransparencyGroup(settings, {
            title: t("Background and Transparency")
        });
        this.add(backgroundTransparencyGroup);

        const shadowGroup = new ShadowGroup(settings, {
            title: t("Main Pill Shadow")
        });
        this.add(shadowGroup);

        const positioningGroup = new PositioningGroup(settings, {
            title: t("Positioning")
        });
        this.add(positioningGroup);

        const dimensionsGroup = new DimensionsGroup(settings, {
            title: t("Dimensions (Dock Mode)")
        });
        this.add(dimensionsGroup);

        const customColorsGroup = new CustomColorsGroup(settings, {
            title: t("Custom Colors")
        });
        this.add(customColorsGroup);
    }
}