import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ComboRowProps } from "@/types/shell-types"
import { t } from "@/utils/translate"

export class TabletModeRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ComboRowProps, ...args: any[]) {
        super(properties, args)

        const model = new Gtk.StringList({
            strings: [t('Off'), t('Skip Only'), t('Play/Pause Only'), t('All Controls')]
        })
        this.set_model(model)
        this.set_selected(settings.pill.tabletMode)

        settings.pill.bind("tabletMode", this, "selected")
    }
}