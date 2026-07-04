import Adw from "gi://Adw";
import GObject from "gi://GObject"
import { PreferencesPageProps } from "@/types/shell-types";
import { GeneralTab } from "./general-actions";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import { MouseActionsTab } from "./mouse-actions";

export class MainPage extends Adw.PreferencesPage {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesPageProps, ...args: any[]) {
        super(properties, args);

        const generalTab = new GeneralTab(settings, {            
            title: t("General Settings")
        });
        this.add(generalTab);

        const mouseActionsTab = new MouseActionsTab(settings, {
            title: t("Mouse Actions")
        });
        this.add(mouseActionsTab);
    }
}