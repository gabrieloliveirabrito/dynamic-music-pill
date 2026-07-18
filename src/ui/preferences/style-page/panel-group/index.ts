import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { PreferencesGroupProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { ArtSizeRow } from "./components.ts/art-size-row";
import { t } from "@/utils/translate";
import { WidgetWidthRow } from "./components.ts/widget-width-row";
import { WidgetHeightRow } from "./components.ts/widget-height-row";

export class PanelGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const artSizeRow = new ArtSizeRow(settings, {
            title: t("Album Art Size")
        });
        this.add(artSizeRow);

        const widgetWidthRow = new WidgetWidthRow(settings, {
            title: t("Widget Width")
        });
        this.add(widgetWidthRow);

        const widgetHeightRow = new WidgetHeightRow(settings, {
            title: t("Widget Height")
        });
        this.add(widgetHeightRow);

        settings.style.connect("changed::target-container", () => {
            this.set_visible(settings.style.targetContainer !== 0);
        });
        this.set_visible(settings.style.targetContainer !== 0);
    }
}