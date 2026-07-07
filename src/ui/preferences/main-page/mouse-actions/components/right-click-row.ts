import Adw from "gi://Adw"
import GObject from "gi://GObject"
import { ComboRowProps } from "@/types/shell-types"
import { SettingsProvider } from "@/providers/settings-provider"
import { MouseActionsTab } from ".."

export class RightClickRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this)
    }
    
    constructor(settings: SettingsProvider, properties: ComboRowProps, ...args: any[]) {
        super(properties, args);

        this.set_selected(MouseActionsTab.ACTION_VALUES.indexOf(settings.mouseActions.rightClick))
        this.connect("notify::selected", () => {
            settings.mouseActions.rightClick = MouseActionsTab.ACTION_VALUES[this.get_selected()]
        })
    }
}