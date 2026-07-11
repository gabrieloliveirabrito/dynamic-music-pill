import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { t } from "@/utils/translate";
import { SettingsProvider } from "@/providers/settings-provider";
import { ComboRowProps } from "@/types/shell-types";

export class FilterModeRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties: ComboRowProps, ...args: any[]) {
        super(properties, args)

        const model = new Gtk.StringList();
        model.append(t("Off (Allow All)"));
        model.append(t("Blacklist (Exclude listed)"));
        model.append(t("Whitelist (Only allow listed)"));

        this.set_model(model);
        this.set_selected(settings.system.playerFilterMode);

        this.connect("notify::selected", () => {
            settings.system.playerFilterMode = this.selected;
        });
    }
}