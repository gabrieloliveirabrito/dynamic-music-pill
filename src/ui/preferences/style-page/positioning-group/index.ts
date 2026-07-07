import Adw from "gi://Adw";
import GObject from "gi://GObject";
import { PreferencesGroupProps } from "@/types/shell-types";
import { SettingsProvider } from "@/providers/settings-provider";
import { t } from "@/utils/translate";
import { ContainerTargetRow } from "./components/container-target-row";
import { DynamicWidthRow } from "./components/dynamic-width-row";
import { AlignmentPresetRow } from "./components/alignment-preset-row";
import { ManualIndexRow } from "./components/manual-index-row";
import { VerticalOffsetRow } from "./components/vertical-offset-row";
import { HorizontalOffsetRow } from "./components/horizontal-offset-row";

export class PositioningGroup extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const positioningRow = new ContainerTargetRow(settings, {
            title: t('Container Target'),
            subtitle: t('Select which UI element should host the music pill'),
        });
        this.add(positioningRow);

        const dynamicWidthRow = new DynamicWidthRow(settings, {
            title: t('Dynamic Width'),
            subtitle: t('Auto-adjust pill width (slider acts as max width)'),
        });
        this.add(dynamicWidthRow);

        const alignmentPresetRow = new AlignmentPresetRow(settings, {
            title: t('Alignment Preset'),
            subtitle: t('How the widget aligns relative to other items'),
        });
        this.add(alignmentPresetRow);

        const manualIndexRow = new ManualIndexRow(settings, {
            title: t('Manual Index Position'),
            subtitle: t('Order in the list (0 is first). Only for Manual mode.'),
        });
        this.add(manualIndexRow);

        const verticalOffsetRow = new VerticalOffsetRow(settings, {
            title: t('Vertical Offset (Y)'),
            subtitle: t('Shift Up (-) or Down (+)'),
        });
        this.add(verticalOffsetRow);

        const horizontalOffsetRow = new HorizontalOffsetRow(settings, {
            title: t('Horizontal Offset (X)'),
            subtitle: t('Shift Left (-) or Right (+)'),
        });
        this.add(horizontalOffsetRow);
    }
}