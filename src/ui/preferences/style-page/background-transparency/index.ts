import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { PreferencesGroupProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import { EnableTransparencyRow } from "./components/enable-transparency-row";
import { ArtTransparencyRow } from "./components/art-transparency-row";
import { BackgroundOpacityRow } from "./components/background-opacity-row";
import { MainPillShadowRow } from "./components/main-pill-shadow-row";
import { TextTransparencyRow } from "./components/text-transparency-row";
import { VisualizerTransparencyRow } from "./components/visualizer-transparency-row";

export class BackgroundTransparencyGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);
        
        const enableTransparencyRow = new EnableTransparencyRow(settings, {
            title: t("Enable Transparency"),
            subtitle: t("Switch between a solid theme background and a custom transparent look"),
        });
        this.add(enableTransparencyRow);

        const backgroundOpacityRow = new BackgroundOpacityRow(settings, {
            title: t("Background Opacity"),
            subtitle: t("Adjust transparency level"),
        });
        this.add(backgroundOpacityRow);

        const artTransparencyRow = new ArtTransparencyRow(settings, {
            title: t("Apply to Album Art")
        });
        this.add(artTransparencyRow);

        const textTransparencyRow = new TextTransparencyRow(settings, {
            title: t("Apply to Text")
        });
        this.add(textTransparencyRow);

        const visualizerTransparencyRow = new VisualizerTransparencyRow(settings, {
            title: t("Apply to Visualizer")
        });
        this.add(visualizerTransparencyRow);

        const mainPillShadowRow = new MainPillShadowRow(settings, {
            title: t("Main Pill Shadow")
        });
        this.add(mainPillShadowRow);
    }
}