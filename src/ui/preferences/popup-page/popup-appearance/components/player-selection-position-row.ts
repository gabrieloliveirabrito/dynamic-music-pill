import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk";
import { ComboRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class PlayerSelectionPositionRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this);
    }
    
    constructor(settings: SettingsProvider, properties: ComboRowProps, ...args: any[]) {
        super(properties, args);

        const model = new Gtk.StringList({ strings: [t('Top'), t('Bottom'), t('Left'), t('Right')] });
        this.set_model(model);
        this.set_selected(settings.popup.playerSelectorPosition);
        settings.popup.bind("playerSelectorPosition", this, "selected");
        settings.popup.connect("changed::player-selector-position", () => {
            this.set_selected(settings.popup.playerSelectorPosition);
        });

        this.connect("notify::selected", () => {
            settings.popup.playerSelectorPosition = this.get_selected();
        });
    }
}