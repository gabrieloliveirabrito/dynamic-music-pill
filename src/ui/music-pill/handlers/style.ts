import { SettingsProvider } from "@/providers/settings-provider";
import { Color } from "@/types/color";
import St from "gi://St";

export type PillStyleState = {
    radius: number;
    paddingX: number;
    paddingY: number;
    shadowCSS: string;
    displayedColor: Color;
    lastBodyCss: string | null;
};

export function applyPillBodyStyle(
    body: St.BoxLayout,
    settings: SettingsProvider,
    state: PillStyleState,
    color: Color,
    alpha = 1,
    playing = false
): void {
    const r = Number.isFinite(color.r) ? Math.floor(color.r) : 40;
    const g = Number.isFinite(color.g) ? Math.floor(color.g) : 40;
    const b = Number.isFinite(color.b) ? Math.floor(color.b) : 40;

    let radius = settings.style.corderRadius;
    if (!Number.isFinite(radius) || radius <= 0) {
        radius = 28;
    }
    state.radius = radius;

    const padX = Number.isFinite(state.paddingX) ? Math.floor(state.paddingX) : 14;
    const padY = Number.isFinite(state.paddingY) ? Math.floor(state.paddingY) : 6;

    let bg = `background-color: rgba(${r}, ${g}, ${b}, ${alpha});`;
    if (settings.style.useCustomColors) {
        const parts = (settings.style.customBgColor || "40,40,40").split(",").map(s => parseInt(s.trim(), 10));
        const cr = Number.isFinite(parts[0]) ? parts[0] : 40;
        const cg = Number.isFinite(parts[1]) ? parts[1] : 40;
        const cb = Number.isFinite(parts[2]) ? parts[2] : 40;
        bg = `background-color: rgba(${cr}, ${cg}, ${cb}, ${alpha});`;
        state.displayedColor = { r: cr, g: cg, b: cb };
    } else {
        state.displayedColor = { r, g, b };
    }

    let border = "border-width: 0px; border-color: transparent;";
    if (settings.style.showPillOutline) {
        const borderOp = playing ? 0.2 : 0.1;
        border = `border-width: 1px; border-style: solid; border-color: rgba(255, 255, 255, ${borderOp});`;
    }

    let shadow = state.shadowCSS || "box-shadow: none;";
    if (settings.pill.enableShadow) {
        const blur = settings.pill.shadowBlur || 8;
        const opacity = (settings.pill.shadowOpacity ?? 50) / 100;
        shadow = `box-shadow: 0 2px ${blur}px rgba(0,0,0,${opacity});`;
        state.shadowCSS = shadow;
    } else {
        shadow = "box-shadow: none;";
        state.shadowCSS = shadow;
    }

    const css = `${bg} ${border} padding: ${padY}px ${padX}px; border-radius: ${radius}px; ${shadow}`;
    if (state.lastBodyCss !== css) {
        state.lastBodyCss = css;
        body.set_style(css);
    }
}
