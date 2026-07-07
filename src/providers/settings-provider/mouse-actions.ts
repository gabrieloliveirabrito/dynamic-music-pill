import Gio from "gi://Gio"
import { createSettingsMap, SchemaKey, SettingsGroup, createSettingsGroup } from "./utils"

const map = createSettingsMap({
    leftClick: {
        key: "action-left-click",
        default: "none"
    },
    doubleClick: {
        key: "action-double-click",
        default: "none"
    },
    middleClick: {
        key: "action-middle-click",
        default: "none"
    },
    rightClick: {
        key: "action-right-click",
        default: "none"
    },
    hoverAction: {
        key: "action-hover",
        default: "none"
    },
    hoverDelay: {
        key: "hover-delay",
        default: 0
    }
})

export type MouseActionsSchema = SchemaKey<typeof map>
export type MouseActionsType = SettingsGroup<typeof map>

export function createMouseActions(settings: Gio.Settings) {
    return createSettingsGroup(settings, map)
}