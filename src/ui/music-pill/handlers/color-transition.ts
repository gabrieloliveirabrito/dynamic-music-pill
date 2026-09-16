import GLib from "gi://GLib";
import { Color } from "@/types/color";
import { MusicPillState } from "../state";

export type ColorTransitionApply = (r: number, g: number, b: number) => void;

/** Faithful port of MusicPill._startColorTransition. */
export function startColorTransition(
    state: MusicPillState,
    apply: ColorTransitionApply,
    playing: boolean,
    hasParent: () => boolean,
): void {
    if (state.colorAnimId !== null) {
        GLib.source_remove(state.colorAnimId);
        state.colorAnimId = null;
    }

    const base = state.targetColor;
    const factor = playing ? 0.6 : 0.4;
    const targetR = Math.floor(base.r * factor);
    const targetG = Math.floor(base.g * factor);
    const targetB = Math.floor(base.b * factor);

    const startR = state.displayedColor.r;
    const startG = state.displayedColor.g;
    const startB = state.displayedColor.b;
    const steps = 60;
    let count = 0;

    state.colorAnimId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 33, () => {
        if (!hasParent()) {
            state.colorAnimId = null;
            return GLib.SOURCE_REMOVE;
        }
        count++;
        const progress = count / steps;
        const t = progress * progress * (3 - 2 * progress);
        const r = Math.floor(startR + (targetR - startR) * t);
        const g = Math.floor(startG + (targetG - startG) * t);
        const b = Math.floor(startB + (targetB - startB) * t);
        apply(r, g, b);
        if (count >= steps) {
            state.displayedColor = { r: targetR, g: targetG, b: targetB };
            state.colorAnimId = null;
            return GLib.SOURCE_REMOVE;
        }
        return GLib.SOURCE_CONTINUE;
    });
}

export function setTargetColor(state: MusicPillState, color: Color): void {
    state.targetColor = {
        r: Math.round(color.r),
        g: Math.round(color.g),
        b: Math.round(color.b),
    };
}
