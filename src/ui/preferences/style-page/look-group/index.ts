import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import { PreferencesGroupProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { VisualizerAnimationRow } from "./components/visualizer-animation-row";
import { t } from "@/utils/translate";
import { VisualizeBarCountRow } from "./components/visualizer-bar-count-row";
import { VisualizeBarWidthRow } from "./components/visualizer-bar-width-row";
import { VisualizerBarHeightRow } from "./components/visualizer-bar-height-row";
import { VisualizerMarginRow } from "./components/visualizer-margin-row";
import { OuterEdgeMarginRow } from "./components/outer-edge-margin-row";
import { CorderRadiusRow } from "./components/corder-radius-row";
import { PillOutlineRow } from "./components/pill-outline-row";

export class LookGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const visualizerAnimationRow = new VisualizerAnimationRow(settings, {
            title: t("Visualizer Animation"),
            subtitle: t("Select the style of the audio reaction bars"),
        });
        this.add(visualizerAnimationRow);

        const cavaNote = new Gtk.Label({
            label: t("Note: 'Real-Time' mode requires the 'cava' package to be installed on your Linux system."),
            wrap: true,
            xalign: 0,
            css_classes: ['dim-label'],
            margin_top: 6, margin_bottom: 6, margin_start: 12, margin_end: 12
        });
        this.add(cavaNote);

        const visualizeBarCountRow = new VisualizeBarCountRow(settings, {
            title: t("Visualizer Bar Count"),
            subtitle: t("Number of bars displayed in the animation"),
        });
        this.add(visualizeBarCountRow);

        const visualizeBarWidthRow = new VisualizeBarWidthRow(settings, {
            title: t("Visualizer Bar Width"),
            subtitle: t("Thickness of individual bars (pixels)"),
        });
        this.add(visualizeBarWidthRow);

        const visualizeBarHeightRow = new VisualizerBarHeightRow(settings, {
            title: t("Visualizer Height"),
            subtitle: t("Maximum height of the visualizer (auto-clamped to pill height)"),
        });
        this.add(visualizeBarHeightRow);

        const visualizerMarginRow = new VisualizerMarginRow(settings, {
            title: t("Visualizer Margin"),
            subtitle: t("Distance between the text and the visualizer animation"),
        });
        this.add(visualizerMarginRow);

        const outerEdgeMarginRow = new OuterEdgeMarginRow(settings, {
            title: t("Outer Edge Margin"),
            subtitle: t("Spacing before the album art and after the visualizer"),
        });
        this.add(outerEdgeMarginRow);

        const corderRadiusRow = new CorderRadiusRow(settings, {
            title: t("Corner Radius"),
            subtitle: t("Roundness of the widget edges (0 = Square, 25 = Pill)"),
        });
        this.add(corderRadiusRow);

        const pillOutlineRow = new PillOutlineRow(settings, {
            title: t("Show Pill Outline"),
            subtitle: t("Display a subtle border around the main pill"),
        });
        this.add(pillOutlineRow);
    }
}