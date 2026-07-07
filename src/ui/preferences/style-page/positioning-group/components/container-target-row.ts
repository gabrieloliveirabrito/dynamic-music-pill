import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { ActionRowProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";

export class ContainerTargetRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ActionRowProps, ...args: any[]) {
        super(properties, args);

        const targetModel = new Gtk.StringList();
        targetModel.append(t("Dock"));
        targetModel.append(t("Panel: Left Box"));
        targetModel.append(t("Panel: Center Box"));
        targetModel.append(t("Panel: Right Box"));
        this.set_model(targetModel);

        this.set_selected(settings.style.targetContainer);

        this.connect('notify::selected', () => {
            settings.style.targetContainer = this.selected;
        });

        settings.style.connect('changed::target-container', () => {
            this.set_selected(settings.style.targetContainer);
        });
    }
}