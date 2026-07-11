import Adw from "gi://Adw"
import GObject from "gi://GObject"
import { PreferencesPageProps } from "@/types/shell-types";
import { WhatsNewGroup } from "./components/whats-new";
import { t } from "@/utils/translate";
import { ExtensionPreferences } from "@girs/gnome-shell/extensions/prefs";

export class AboutPage extends Adw.PreferencesPage {
    static {
        GObject.registerClass(this);
    }

    constructor(prefs: ExtensionPreferences, properties?: PreferencesPageProps, ...args: any[]) {
        super(properties, args);

        const whatsNewGroup = new WhatsNewGroup(prefs.dir, {
            title: t('What\'s New'),
        });
        this.add(whatsNewGroup);
    }
}