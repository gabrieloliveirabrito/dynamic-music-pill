import Adw from "gi://Adw";
import GObject from "gi://GObject";

import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import { HelpExpanderRow } from "./components/help-expander-row";
import { t } from "@/utils/translate";

export class MappingHelpGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const helpExpander = new HelpExpanderRow(settings, {
            title: t('💡 How to find the correct App ID?'),
            subtitle: t('Click here for a quick guide and examples')
        });
        this.add(helpExpander);
    }
}