import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { logDebug } from "@/utils/log";

let disableRequests = 0;
let dockManager: { _allDocks?: Array<{ dash: { requiresVisibility: boolean }; _show(): void; _updateDashVisibility(): void }> } | null = null;
let importPromise: Promise<void> | null = null;

export function initDTDModule(): Promise<void> | null {
    let ext = Main.extensionManager.lookup("dash-to-dock@micxgx.gmail.com");
    if (!ext || ext.state !== 1) {
        ext = Main.extensionManager.lookup("ubuntu-dock@ubuntu.com");
    }
    if (!ext || ext.state !== 1) {
        return null;
    }
    if (importPromise) {
        return importPromise;
    }

    importPromise = import(`file://${ext.path}/extension.js`).then((mod: { dockManager?: typeof dockManager }) => {
        dockManager = mod.dockManager ?? null;
        if (disableRequests > 0) {
            applyDisable();
        }
    }).catch((e: Error) => {
        logDebug(`DTD import error: ${e.message}`);
        importPromise = null;
    });

    return importPromise;
}

function applyDisable(): void {
    if (!dockManager?._allDocks) {
        return;
    }
    try {
        for (const dock of dockManager._allDocks) {
            dock.dash.requiresVisibility = true;
            dock._show();
        }
    } catch (e) {
        logDebug(`DTD disable error: ${(e as Error).message}`);
    }
}

function applyRestore(): void {
    if (!dockManager?._allDocks) {
        return;
    }
    try {
        for (const dock of dockManager._allDocks) {
            dock.dash.requiresVisibility = false;
            dock._updateDashVisibility();
        }
    } catch (e) {
        logDebug(`DTD restore error: ${(e as Error).message}`);
    }
}

export function disableDashToDockAutohide(): void {
    disableRequests++;
    if (disableRequests === 1) {
        if (dockManager) {
            applyDisable();
        } else {
            initDTDModule();
        }
    }
}

export function restoreDashToDockAutohide(): void {
    if (disableRequests <= 0) {
        return;
    }
    disableRequests--;
    if (disableRequests === 0 && dockManager) {
        applyRestore();
    }
}
