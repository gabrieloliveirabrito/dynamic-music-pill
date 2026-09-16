import GLib from "gi://GLib";
import St from "gi://St";
import { SettingsProvider } from "@/providers/settings-provider";
import { MusicPill } from "@/ui/music-pill";
import { StBoxWithSignals } from "@/types/shell-types";
import { isDockContainer, resolveTargetContainer } from "./container-resolver";
import { setupDragFix, teardownDragFix } from "./drag-fix";

export type PillInjector = {
    inject(): void;
    queueInject(): void;
    destroy(): void;
};

export function createPillInjector(pill: MusicPill, settings: SettingsProvider): PillInjector {
    let injectTimeout: number | null = null;
    let currentDock: StBoxWithSignals | null = null;
    let isMovingItem = false;
    let isUserDragging = false;

    function ensurePosition(container: St.BoxLayout): boolean {
        if (isMovingItem || isUserDragging) {
            return false;
        }

        const mode = settings.pill.alignmentPreset;
        const manualIndex = settings.pill.manualIndex;
        const children = container.get_children();
        const otherChildren = children.filter(c => c !== pill);
        const realItemCount = otherChildren.length;
        let targetIndex = 0;

        if (mode === 0) {
            targetIndex = manualIndex;
        } else if (mode === 1) {
            targetIndex = 0;
        } else if (mode === 2) {
            targetIndex = Math.floor(realItemCount / 2);
        } else if (mode === 3) {
            targetIndex = realItemCount;
        }

        targetIndex = Math.max(0, Math.min(targetIndex, realItemCount));

        let currentIndex = children.indexOf(pill);
        const pillParent = pill.get_parent() as St.BoxLayout | null;

        if (currentIndex === -1 && pillParent === container) {
            currentIndex = 0;
        }
        if (pillParent && pillParent !== container) {
            pillParent.remove_child(pill);
            currentIndex = -1;
        }

        if (currentIndex !== targetIndex) {
            isMovingItem = true;
            if (currentIndex !== -1) {
                container.set_child_at_index(pill, targetIndex);
            } else {
                container.insert_child_at_index(pill, targetIndex);
            }
            isMovingItem = false;
            return true;
        }
        return false;
    }

    function inject(): void {
        if (injectTimeout !== null) {
            GLib.source_remove(injectTimeout);
            injectTimeout = null;
        }

        const target = settings.style.targetContainer;
        const container = resolveTargetContainer(target) as StBoxWithSignals | null;
        if (!container) {
            return;
        }

        const oldParent = pill.get_parent() as StBoxWithSignals | null;
        const parentChanged = oldParent !== null && oldParent !== container;

        if (parentChanged && oldParent) {
            oldParent.remove_child(pill);
            if (currentDock?.disconnectObject) {
                currentDock.disconnectObject(pill);
                currentDock = null;
            }
            teardownDragFix(container);
        }

        if (target === 0 && currentDock !== container) {
            currentDock = container;
            container.connectObject?.("child-added", (_c: unknown, actor: unknown) => {
                if (actor !== pill && !isMovingItem) {
                    queueInject();
                }
            }, pill);
            container.connectObject?.("child-removed", () => {
                if (!isMovingItem) {
                    queueInject();
                }
            }, pill);
        }

        const moved = ensurePosition(container);

        if (parentChanged || moved || !oldParent) {
            pill.updateDimensions();
        }

        if (target === 0) {
            setupDragFix(container, pill, () => isMovingItem, (v) => { isMovingItem = v; });
        }
    }

    function queueInject(): void {
        if (injectTimeout !== null) {
            GLib.source_remove(injectTimeout);
        }
        injectTimeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 100, () => {
            inject();
            injectTimeout = null;
            return GLib.SOURCE_REMOVE;
        });
    }

    function destroy(): void {
        if (injectTimeout !== null) {
            GLib.source_remove(injectTimeout);
            injectTimeout = null;
        }
        if (currentDock?.disconnectObject) {
            currentDock.disconnectObject(pill);
            currentDock = null;
        }
        const parent = pill.get_parent() as StBoxWithSignals | null;
        if (parent && isDockContainer(parent)) {
            teardownDragFix(parent);
        }
    }

    return { inject, queueInject, destroy };
}
