import Adw from "gi://Adw"
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import { PreferencesGroupProps } from "@/types/shell-types"
import { SettingsProvider } from "@/providers/settings-provider"
import { t } from "@/utils/translate"
import { LeftClickRow } from "./components/left-click-row"
import { DoubleClickRow } from "./components/double-click-row"
import { MidClickRow } from "./components/mid-click-row"
import { RightClickRow } from "./components/right-click-row"
import { HoverRow } from "./components/hover-row"
import { HoverDelayRow } from "./components/hover-delay-row"

export class MouseActionsTab extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this)
    }

    static ACTION_VALUES = ['none', 'play_pause', 'next', 'previous', 'open_app', 'toggle_menu', 'open_player_menu', 'open_settings', 'close_app'];
    
    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const actionModel = new Gtk.StringList({strings: [
            t("None"),
            t("Play / Pause"),
            t("Next Track"),
            t("Previous Track"),
            t("Open Player App"),
            t("Open Menu"),
            t("Select Player"),
            t("Open Settings"),
            t("Close Player App")
        ]})

        const leftClickRow = new LeftClickRow(settings, {
            title: t("Left Click"),
            model: actionModel
        })
        this.add(leftClickRow)

        const doubleClickRow = new DoubleClickRow(settings, {
            title: t("Double Click"),
            model: actionModel
        })
        this.add(doubleClickRow)

        const midClickRow = new MidClickRow(settings, {
            title: t("Middle Click"),
            model: actionModel
        })
        this.add(midClickRow)

        const rightClickRow = new RightClickRow(settings, {
            title: t("Right Click"),
            model: actionModel
        })
        this.add(rightClickRow)

        const hoverRow = new HoverRow(settings, {
            title: t("Hover Action"),
            model: actionModel
        })
        this.add(hoverRow)

        const hoverDelayRow = new HoverDelayRow(settings, {
            title: t("Hover Delay (ms)"),
        })
        this.add(hoverDelayRow);
    }
}