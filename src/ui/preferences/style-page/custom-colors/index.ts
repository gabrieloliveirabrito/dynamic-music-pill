import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import { SyncAccentRow } from "./components/sync-accent-row";
import { t } from "@/utils/translate";
import { UseCustomColorsRow } from "./components/use-custom-colors-row";
import { ColorButtonRow } from "./components/color-button-row";

export class CustomColorsGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const syncAccentRow = new SyncAccentRow(settings, {
            title: t("Sync GNOME Accent Color"),
            subtitle: t("Dynamically change the GNOME Shell accent color to match the album art")
        });
        this.add(syncAccentRow);

        const useCustomColorsRow = new UseCustomColorsRow(settings, {
            title: t("Use Custom Colors"),
            subtitle: t("Override dynamic colors")
        });
        this.add(useCustomColorsRow);

        const customBgColorRow = new ColorButtonRow(settings, "customBgColor", {
            title: t("Background Color")
        });
        this.add(customBgColorRow);

        const customTextColorRow = new ColorButtonRow(settings, "customTextColor", {
            title: t("Text Color")
        });
        this.add(customTextColorRow);
    }
}