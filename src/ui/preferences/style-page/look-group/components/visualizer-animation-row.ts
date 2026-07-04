import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { SettingsProvider } from "@/providers/settings-provider";
import { ComboRowProps } from "@/types/shell-types";
import { t } from "@/utils/translate";

export class VisualizerAnimationRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties?: ComboRowProps, ...args: any[]) {
        super(properties, args);

        const visualizerAnimationModel = new Gtk.StringList({strings: [
            t("Off (Disabled)"),
            t("Wave (Smooth)"),
            t("Beat (Jumpy)"),
            t("Real-Time (Cava needed)"),
        ]});

        this.set_model(visualizerAnimationModel);
        this.set_selected(settings.style.visualizerAnimation);
        this.connect('notify::selected', () => {
            settings.style.visualizerAnimation = this.selected;
        });
    }
}