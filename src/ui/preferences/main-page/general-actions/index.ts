import Adw from "gi://Adw";
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"
import { PreferencesGroupProps } from "@/types/shell-types";
import { AlwaysShowRow } from "./components/always-show-row";
import { ArtRow } from "./components/art-row";
import { FallbackRow } from "./components/fallback-row";
import { ScrollCtrlRow } from "./components/scroll-ctrl-row";
import { SettingsProvider } from "@/providers/settings-provider";
import { ScrollActionRow } from "./components/scroll-action-row";
import { InvertRow } from "./components/invert-row";
import { InvertDirRow } from "./components/invert-dir-row";
import { ScrollTextRow } from "./components/scroll-text-row";
import { ScrollHoverRow } from "./components/scroll-hover-row";
import { ScrollPauseRow } from "./components/scroll-pause-row";
import { LyricsRow } from "./components/lyrics-row";
import { LangPrefRow } from "./components/lang-pref-row";
import { LyricFadeRow } from "./components/lyric-fade-row";
import { LyricFadeDurationRow } from "./components/lyric-fade-duration-row";
import { TabletModeRow } from "./components/tablet-mode-row";
import { ControlPosRow } from "./components/control-pos-row";
import { InlineArtistRow } from "./components/inline-artist-row";
import { ShowArtistRow } from "./components/show-artist-row";
import { t } from "@/utils/translate";
import { HideTextRow } from "./components/hide-text.row";

export class GeneralTab extends Adw.PreferencesGroup {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: PreferencesGroupProps, ...args: any[]) {
        super(properties, args);

        const alwaysShowRow = new AlwaysShowRow(settings, {
            title: t("Always ON"),
            subtitle: t('Retain last known track and keep pill visible after closing the player')
        })
        this.add(alwaysShowRow);

        const artRow = new ArtRow(settings, {
            title: t("Show Album Art"),
            subtitle: t("Displa the cover art of the currently playing song")
        });
        this.add(artRow);

        const fallbackRow = new FallbackRow(settings, {
            title: t("Fallback Album Art"),
            subtitle: settings.fallbackArt.artPath || t("No image selected")
        });
        this.add(fallbackRow);

        const scrollCtrlRow = new ScrollCtrlRow(settings, {
            title: t('Enable Scroll Controls'),
            subtitle: t('Change Tracks, Volume or Media Player using scroll wheel or touchpad')
        });
        this.add(scrollCtrlRow);

        const scrollActionRow = new ScrollActionRow(settings, {
            title: t('Scroll Action'),
            subtitle: t('Choose what scrolling on the pill should do'),
        })
        this.add(scrollActionRow);

        const invertRow = new InvertRow(settings, {
            title: t('Invert Scroll Animation'),
            subtitle: t('Direction of the jump effect (Natural vs Traditional)'),
        })
        this.add(invertRow);

        const invertDirRow = new InvertDirRow(settings, {
            title: t('Invert Scroll Direction'),
            subtitle: t('Swap up/down scrolling for track and volume actions')
        });
        this.add(invertDirRow);

        const scrollTextRow = new ScrollTextRow(settings, {
            title: t('Scrolling Text'),
            subtitle: t('Animate long track titles and artist names')
        });
        this.add(scrollTextRow);

        const scrollHoverRow = new ScrollHoverRow(settings, {
            title: t('Scroll Only on Hover'),
            subtitle: t('Text stays still until you hover the pill')
        })
        this.add(scrollHoverRow)

        const scrollPauseRow = new ScrollPauseRow(settings, {
            title: t('Freeze Scroll on Pause'),
            subtitle: t('Stop the text scrolling animation when the media player is paused')
        })
        this.add(scrollPauseRow)

        const lyricsRow = new LyricsRow(settings, {
            title: t('Lyrics Display'),
            subtitle: t('Show real-time synchronized lyrics for current track.')
        })
        this.add(lyricsRow)

        const langPrefRow = new LangPrefRow(settings, {
            title: t('Lyrics language preference'),
            subtitle: t('When multiple versions exist'),
        })
        this.add(langPrefRow)

        const lyricFadeRow = new LyricFadeRow(settings, {
            title: t('Lyrics Fade-in Effect'),
            subtitle: t('Smoothly fade in new lyric lines')
        });
        this.add(lyricFadeRow);

        const lyricFadeDurationRow = new LyricFadeDurationRow(settings, {
            title: t('Fade Duration (ms)')
        });
        this.add(lyricFadeDurationRow);

        const tabletModeRow = new TabletModeRow(settings, {
            title: t('Tablet Mode Controls'),
            subtitle: t('Show media buttons directly on the pill')
        });
        this.add(tabletModeRow);

        const controlPosRow = new ControlPosRow(settings, {
            title: t('Controls Position'),
            subtitle: t('Where to place the tablet controls on the pill')
        });
        this.add(controlPosRow);

        const inlineArtistRow = new InlineArtistRow(settings, {
            title: t('Inline Artist'), 
            subtitle: t('Show "Title • Artist" when the widget is squeezed')
        })
        this.add(inlineArtistRow)

        const showArtistRow = new ShowArtistRow(settings, {
            title: t('Show Artist'), 
            subtitle: t('Show the artist name in the main music pill')
        });
        this.add(showArtistRow);

        const hideTextRow = new HideTextRow(settings, {
            title: t('Compact Mode (Hide Text)'),
            subtitle: t('Hide title and artist')
        })
        this.add(hideTextRow)
    }
}