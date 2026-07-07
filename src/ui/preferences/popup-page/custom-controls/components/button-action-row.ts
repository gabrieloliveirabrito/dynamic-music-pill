import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ComboRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { CustomControls } from "..";

export class ButtonActionRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(title: string, subtitle: string, settingsKey: "customButton1" | "customButton2", settings: SettingsProvider, properties: ComboRowProps, ...args: any[]) {
        super(properties, args);

        const currentValue = settings.popup[settingsKey];
        const currentIndex = CustomControls.ACTION_VALUES.indexOf(currentValue);

        this.set_title(title);
        this.set_subtitle(subtitle);
        this.set_selected(currentIndex);
        
        settings.popup.connect(`changed::${settingsKey}`, () => {
            const currentValue = settings.popup[settingsKey];
            const currentIndex = CustomControls.ACTION_VALUES.indexOf(currentValue);
            this.set_selected(currentIndex);
        });

        this.connect('notify::selected', () => {
            settings.popup[settingsKey] = CustomControls.ACTION_VALUES[this.selected];
        });

        settings.popup.bind("enableCustomButtons", this, "sensitive");
    }
}