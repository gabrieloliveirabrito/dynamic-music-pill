import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { PreferencesGroupProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import { EnableShadowRow } from "./components/enable-shadow-row";
import { ShadowIntensityRow } from "./components/shadow-intensity-row";
import { ShadowBlurRow } from "./components/shadow-blur-row";

export class ShadowGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);
        
        const enableShadowRow = new EnableShadowRow(settings, {
            title: t("Enable Shadow")
        });
        this.add(enableShadowRow);

        const shadowIntensityRow = new ShadowIntensityRow(settings, {
            title: t("Shadow Intensity")
        });
        this.add(shadowIntensityRow);

        const shadowBlurRow = new ShadowBlurRow(settings, {
            title: t("Shadow Blur")
        });
        this.add(shadowBlurRow);
    }
}