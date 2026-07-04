import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ComboRowProps } from "@/types/shell-types"
import { t } from "@/utils/translate"

export class LangPrefRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties: ComboRowProps, ...args: any[]) {
        super(properties, args)

        const model = Gtk.StringList.new([
            t('Auto'),
            t('Prefer original script'),
            t('Prefer Latin'),
        ])
        this.set_model(model)

        this.set_selected(settings.lyrics.preferedLanguage)
        this.connect("notify::selected", () => {
            settings.lyrics.preferedLanguage = this.get_selected();
        });
    }
}