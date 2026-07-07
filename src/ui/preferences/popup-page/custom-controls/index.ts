import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { PreferencesGroupProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import { EnableButtonsRow } from "./components/enable-buttons-row";
import { ButtonActionRow } from "./components/button-action-row";

export class CustomControls extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    static ACTION_VALUES = ['none', 'volume', 'seek_step', 'output_switch', 'sleep_timer', 'playback_speed', 'history'];
    
    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const buttonActionModel = new Gtk.StringList({strings: [
            t("None"),
            t("Volume Control"),
            t("Seek ±10 Seconds"),
            t("Audio Output Switcher"),
            t("Sleep Timer"),
            t("Playback Speed"),
            t("Track History"),
        ]});
        const enableButtonsRow = new EnableButtonsRow(settings, {
            title: t("Enable Custom Buttons"),
            subtitle: t("Show additional action buttons next to Shuffle and Loop")
        });
        this.add(enableButtonsRow);
        
        this.set_description(t("If both buttons are set to Seek, they act directly (Button 1 = −10s, Button 2 = +10s). Otherwise Seek opens a sub-page."));

        const buttonActionRow = new ButtonActionRow(t("Custom Button 1"), t("Placed left of Shuffle."), "customButton1", settings, {
            model: buttonActionModel,
        });
        this.add(buttonActionRow);

        const buttonActionRow2 = new ButtonActionRow(t("Custom Button 2"), t("Placed right of Loop."), "customButton2", settings, {
            model: buttonActionModel,
        });
        this.add(buttonActionRow2);

    }
}