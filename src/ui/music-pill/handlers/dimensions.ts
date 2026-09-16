import Clutter from "gi://Clutter";
import St from "gi://St";
import { SettingsProvider } from "@/providers/settings-provider";
import { CrossfadeArt } from "@/components";
import { WaveformVisualizer } from "@/ui/visualizers";
import { MusicPillState } from "../state";
import { TextBlock } from "../components/text-block";
import { TabletControls } from "../components/tablet-controls";

export type DimensionActors = {
    pill: St.Widget;
    body: St.BoxLayout;
    artWidget: CrossfadeArt;
    artBin: St.Bin;
    textBlock: TextBlock;
    visualizer: WaveformVisualizer;
    visBin: St.Bin;
    tabletControls: TabletControls;
};

/**
 * Faithful port of MusicPill._updateDimensions from srcJS/uiMusicPill.js
 * (core dock/panel sizing, art, visualizer visibility, fonts).
 */
export function updatePillDimensions(
    settings: SettingsProvider,
    state: MusicPillState,
    actors: DimensionActors,
    currentStatus: string,
    isPopupOpen = false,
): void {
    const { pill, body, artWidget, artBin, textBlock, visualizer, visBin, tabletControls } = actors;
    if (!pill.get_parent()) {
        return;
    }

    const target = settings.style.targetContainer;
    state.inPanel = target > 0;

    const parent = pill.get_parent();
    let isSidePanel = false;
    if (parent && !state.inPanel) {
        const [pw, ph] = parent.get_size();
        if (pw > 0 && ph > 0 && pw < ph) {
            isSidePanel = true;
        }
    }

    pill.set_width(-1);

    const confWidth = state.inPanel ? settings.style.panelWidth : settings.pill.dockWidth;
    const width = confWidth;
    const height = state.inPanel ? settings.style.panelHeight : settings.pill.dockHeight;
    const prefArtSize = state.inPanel ? settings.style.panelArtSize : settings.pill.albumArtSize;

    const vOffset = settings.pill.verticalOffset;
    const hOffset = settings.pill.horizontalOffset;
    const visStyle = settings.style.visualizerAnimation;
    state.radius = settings.style.corderRadius;

    const shadowEnabled = settings.pill.enableShadow;
    const shadowBlur = settings.pill.shadowBlur;
    const shadowOpacity = settings.pill.shadowOpacity / 100.0;

    let fontSizeTitle = "11pt";
    let fontSizeArtist = "9pt";

    if (state.inPanel) {
        state.paddingY = 0;
        fontSizeTitle = "10pt";
        fontSizeArtist = "8pt";
    } else {
        const rawPadY = Math.floor(height / 10);
        state.paddingY = Math.max(2, Math.min(8, rawPadY));
    }

    state.paddingX = settings.style.outerEdgeMargin;

    if (isSidePanel) {
        const temp = state.paddingX;
        state.paddingX = state.paddingY;
        state.paddingY = temp;
    }

    let hideText = settings.pill.hideText;
    if (isSidePanel) {
        hideText = true;
        (body.layout_manager as Clutter.BoxLayout).orientation = Clutter.Orientation.VERTICAL;
    } else {
        (body.layout_manager as Clutter.BoxLayout).orientation = Clutter.Orientation.HORIZONTAL;
    }

    textBlock.visible = !hideText;
    body.translation_y = vOffset;
    body.translation_x = hOffset;

    if (shadowEnabled) {
        state.shadowCSS = `box-shadow: 0px 2px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity});`;
    } else {
        state.shadowCSS = "box-shadow: none;";
    }

    const artRadius = Math.max(4, state.radius - (isSidePanel ? state.paddingX : state.paddingY));
    let maxArtHeight = (isSidePanel ? width : height) - (2 * (isSidePanel ? state.paddingX : state.paddingY));
    if (maxArtHeight < 10) {
        maxArtHeight = 10;
    }
    const finalArtSize = Math.min(prefArtSize, maxArtHeight);

    artWidget.set_width(finalArtSize);
    artWidget.set_height(finalArtSize);
    artBin.set_width(finalArtSize);
    artBin.set_height(finalArtSize);
    artWidget.setRadius(artRadius);
    artWidget.setShadowStyle(state.shadowCSS);

    visualizer.setMode(visStyle);
    visualizer.setHeightClamped(maxArtHeight);

    const tabletSetting = settings.pill.tabletMode;
    tabletControls.applyMode(tabletSetting, state.gameMode);
    repositionTabletControls(body, tabletControls, settings.pill.controlsPosition);

    if (isSidePanel) {
        (tabletControls.layout_manager as Clutter.BoxLayout).orientation = Clutter.Orientation.VERTICAL;
        tabletControls.set_style("margin: 0px;");
    } else {
        (tabletControls.layout_manager as Clutter.BoxLayout).orientation = Clutter.Orientation.HORIZONTAL;
        const controlsPos = settings.pill.controlsPosition;
        tabletControls.set_style(
            controlsPos === 0
                ? "margin-left: 6px; margin-top: 0px;"
                : "margin-left: 6px; margin-right: 4px; margin-top: 0px;"
        );
    }

    let forceHideVis = isPopupOpen
        && settings.popup.hidePillVisualizer
        && settings.popup.showVisualizer;
    if (currentStatus === "Stopped") {
        // Legacy only force-hides when title is "No Media"; keep vis when paused track exists
        forceHideVis = forceHideVis || false;
    }

    const isDynamic = settings.pill.dynamicWidth;

    if ((width < 220 && !hideText && !isDynamic) || visStyle === 0 || forceHideVis) {
        visBin.hide();
        visBin.set_width(0);
        visBin.set_height(0);
        visBin.set_style("margin: 0px;");

        if (!tabletSetting || state.gameMode) {
            const artMargin = hideText ? 0 : ((width < 180) ? 4 : 8);
            artBin.set_style(isSidePanel
                ? `margin-bottom: ${artMargin}px; margin-right: 0px;`
                : `margin-right: ${artMargin}px; margin-bottom: 0px;`);
        } else {
            const artMargin = hideText ? 0 : 2;
            artBin.set_style(isSidePanel
                ? `margin-bottom: ${artMargin}px; margin-right: 0px;`
                : `margin-right: ${artMargin}px; margin-bottom: 0px;`);
        }
    } else {
        visBin.show();
        const sideMargin = hideText ? 6 : settings.style.visualizerMargin;

        if (isSidePanel) {
            visBin.set_style(`margin-top: ${sideMargin}px; margin-left: 0px;`);
            visBin.set_height(-1);
            visBin.set_width(finalArtSize);
            artBin.set_style(`margin-bottom: ${sideMargin}px; margin-right: 0px;`);
        } else {
            visBin.set_style(`margin-left: ${sideMargin}px; margin-top: 0px;`);
            visBin.set_width(-1);
            visBin.set_height(-1);
            artBin.set_style(`margin-right: ${sideMargin}px; margin-bottom: 0px;`);
        }
    }

    const customTextStr = settings.style.useCustomColors
        ? `rgb(${settings.style.customTextColor})`
        : "white";
    const customTextAlpha = settings.style.useCustomColors
        ? `rgba(${settings.style.customTextColor}, 0.7)`
        : "rgba(255,255,255,0.7)";

    const borderOffset = settings.style.showPillOutline ? 2 : 0;
    const effectiveHeight = height - borderOffset;
    const showArtist = settings.pill.showArtist;

    if (!showArtist) {
        textBlock.setArtistVisible(false);
    } else if (effectiveHeight < 46 && !state.inPanel) {
        textBlock.setArtistVisible(false);
    } else if (state.inPanel && effectiveHeight < 30) {
        textBlock.setArtistVisible(false);
    } else {
        textBlock.setArtistVisible(true);
    }

    textBlock.setLabelStyles(
        `font-size: ${fontSizeTitle}; font-weight: 800; color: ${customTextStr}; margin: 0px; padding: 0px;`,
        `font-size: ${fontSizeArtist}; font-weight: 500; color: ${customTextAlpha}; margin: 0px; padding: 0px;`
    );

    state.targetWidth = confWidth;
    body.set_height(height);
    if (!settings.pill.dynamicWidth && !hideText && confWidth > 0) {
        body.set_width(confWidth);
    }
    pill.set_height(height);
}

export function repositionTabletControls(
    body: St.BoxLayout,
    tabletControls: TabletControls,
    pos: number,
): void {
    if (tabletControls.get_parent() === body) {
        body.remove_child(tabletControls);
    }
    // Without tablet: art(0), text(1), vis(2)
    switch (pos) {
        case 1:
            body.insert_child_at_index(tabletControls, 2);
            break;
        case 2:
            body.add_child(tabletControls);
            break;
        default:
            body.insert_child_at_index(tabletControls, 1);
            break;
    }
}
