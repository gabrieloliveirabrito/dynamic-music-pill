import Adw from "gi://Adw";
import GObject from "gi://GObject"
import { PreferencesPageProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import { PopupAppearance } from "./popup-appearance";
import { CustomControls } from "./custom-controls";

export class PopupPage extends Adw.PreferencesPage {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: PreferencesPageProps, ...args: any[]) {
        super(properties, args);

        const appearanceTab = new PopupAppearance(settings, {
            title: t("Pop-up Appearance")
        });
        this.add(appearanceTab);

        const customControlsTab = new CustomControls(settings, {
            title: t('Custom Control Buttons'),
            description: t("Add up to two extra buttons in the expanded player's controls row.")
        });
        this.add(customControlsTab);
    }
}