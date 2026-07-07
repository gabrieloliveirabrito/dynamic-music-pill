import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ComboRowProps } from "@/types/shell-types"
import { t } from "@/utils/translate"

export class ControlPosRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ComboRowProps, ...args: any[]) {
        super(properties, args)

        const model = new Gtk.StringList({
            strings: [t('Before Text'), t('After Text'), t('After Visualizer')]
        });
        this.set_model(model)
        this.set_selected(settings.pill.controlsPosition)

        this.connect("notify::selected", () => {
            settings.pill.controlsPosition = this.get_selected();
        });
        settings.pill.bind("controlsPosition", this, "selected");
        
        this.sensitive = settings.pill.tabletMode > 0;
        settings.pill.bind("tabletMode", this, "sensitive")
    }
}