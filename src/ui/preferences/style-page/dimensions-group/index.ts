import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { PreferencesGroupProps } from "@/types/shell-types";
import { AlbumArtSizeRow } from "./components/album-art-size-row";
import { t } from "@/utils/translate";
import { WidgetWidthRow } from "./components/widget-width-row";
import { WidgetHeightRow } from "./components/widget-height-row";

export class DimensionsGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const albumArtSizeRow = new AlbumArtSizeRow(settings, {
            title: t("Album Art Size")
        });
        this.add(albumArtSizeRow);

        const widgetWidthRow = new WidgetWidthRow(settings, {
            title: t("Widget Width")
        });
        this.add(widgetWidthRow);

        const widgetHeightRow = new WidgetHeightRow(settings, {
            title: t("Widget Height")
        });
        this.add(widgetHeightRow);
    }
}