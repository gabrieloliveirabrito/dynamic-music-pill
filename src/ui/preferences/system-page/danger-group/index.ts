import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import Adw from "gi://Adw"
import GObject from "gi://GObject"
import { FactoryResetRow } from "./components/factory-reset-row";
import { t } from "@/utils/translate";

export class DangerGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const factoryResetRow = new FactoryResetRow(settings, {
            title: t('Factory Reset')
        });
        this.add(factoryResetRow);
    }
}