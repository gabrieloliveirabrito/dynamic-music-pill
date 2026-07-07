import { Color } from "../../types/color";

export interface MusicPillState {
    lastScrollTime: number;
    isActive: boolean;

    targetWidth: number;
    paddingX: number;
    paddingY: number;
    radius: number;

    shadowCSS: string;
    inPanel: boolean;
    gameMode: boolean;
    currentBusName: string | null;

    displayedColor: Color;
    targetColor: Color;

    colorAnimId: number | null;
    hideGraceTimer: number | null;

    lastBodyCss: string | null;
    lastLeftCss: string | null;
    lastRightCss: string | null;
}