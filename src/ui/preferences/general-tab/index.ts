import { PreferencesPageProps } from "@/types/shell-types";
import { gettext as _ } from "@girs/gnome-shell/extensions/prefs"
import Adw from "gi://Adw";
import Gio from "gi://Gio"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { AlwaysShowRow } from "./always-show-row";
import { ArtRow } from "./art-row";
import { FallbackRow } from "./fallback-row";
import { ScrollCtrlRow } from "./scroll-ctrl-row";
import { SettingsProvider } from "@/providers/settings-provider";
import { ScrollActionRow } from "./scroll-action-row";

export class GeneralTab extends Adw.PreferencesPage {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesPageProps, ...args: any[]) {
        super(properties, args);

        const genGroup = new Adw.PreferencesGroup({
            title: _("General Settings")
        })

        const alwaysShowRow = new AlwaysShowRow(settings, {
            title: _("Always ON"),
            subtitle: _('Retain last known track and keep pill visible after closing the player')
        })
        genGroup.add(alwaysShowRow);

        const artRow = new ArtRow(settings, {
            title: _("Show Album Art"),
            subtitle: _("Displa the cover art of the currently playing song")
        });
        genGroup.add(artRow);

        const fallbackRow = new FallbackRow(settings, {
            title: _("Fallback Album Art"),
            subtitle: settings.fallbackArt.artPath || _("No image selected")
        });
        genGroup.add(fallbackRow);

        const scrollCtrlRow = new ScrollCtrlRow(settings, {
            title: _('Enable Scroll Controls'),
            subtitle: _('Change Tracks, Volume or Media Player using scroll wheel or touchpad')
        });
        genGroup.add(scrollCtrlRow);

        const scrollActionRow = new ScrollActionRow(settings, {
            title: _('Scroll Action'),
            subtitle: _('Choose what scrolling on the pill should do'),
        })
        genGroup.add(scrollActionRow);

        this.add(genGroup);
    }
}