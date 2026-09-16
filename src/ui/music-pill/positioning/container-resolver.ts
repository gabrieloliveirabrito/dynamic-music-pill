import St from "gi://St";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { ShellPanel } from "@/types/shell-types";

export function resolveTargetContainer(targetContainer: number): St.BoxLayout | null {
    const panel = Main.panel as unknown as ShellPanel;
    const statusArea = panel.statusArea;

    if (targetContainer === 0) {
        const dtd = statusArea["dash-to-dock"] ?? statusArea["ubuntu-dock"];
        const dashBox = dtd?._box;
        return dashBox ?? (Main.overview.dash._box as St.BoxLayout);
    }
    if (targetContainer === 1) {
        return panel._leftBox;
    }
    if (targetContainer === 2) {
        return panel._centerBox;
    }
    if (targetContainer === 3) {
        return panel._rightBox;
    }
    return null;
}

export function isDockContainer(container: St.BoxLayout): boolean {
    const panel = Main.panel as unknown as ShellPanel;
    const statusArea = panel.statusArea;
    const dtd = statusArea["dash-to-dock"] ?? statusArea["ubuntu-dock"];
    if (dtd && dtd._box === container) {
        return true;
    }
    return Main.overview.dash._box === container;
}
