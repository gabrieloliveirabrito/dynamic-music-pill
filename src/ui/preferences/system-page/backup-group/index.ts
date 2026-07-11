import Adw from "gi://Adw"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { PreferencesGroupProps } from "@/types/shell-types"
import { ExportRow } from "./components/export-row";
import { t } from "@/utils/translate";
import { ImportRow } from "./components/import-row";

export class BackupGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const exportRow = new ExportRow(settings,{
                title: t('Export Settings')
        });
        this.add(exportRow);
        
        const importRow = new ImportRow(settings,{
            title: t('Import Settings')
        });
        this.add(importRow);
    }
}