import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ExpanderRowProps } from "@/types/shell-types";
import { t } from "@/utils/translate";

export class HelpExpanderRow extends Adw.ExpanderRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties?: ExpanderRowProps, ...args: any[]) {
        super(properties, args);

        let label = "To allow the extension to open/close your player, you need to provide its ";
        label += "exact window name (App ID).\n";
        label += "\n"; 
        label += "<b>Common Examples:</b>\n";
        label += "• Spotify (Flatpak): <b>com.spotify.Client</b>\n";
        label += "• VLC: <b>vlc</b>\n";
        label += "• YouTube Music (Web App): <b>youtube-music</b>\n";
        label += "• High Tide: <b>io.github.nokse22.high-tide</b>\n";
        label += "• Browsers: <b>chromium</b>, <b>firefox</b>, <b>brave-browser</b>\n";
        label += "\n";
        label += "<b>How to find it manually:</b>\n";
        label += "1. Press <b>Alt + F2</b>, type <b>lg</b>, and press Enter.\n";
        label += "2. Click on the <b>Windows</b> tab in the top right corner.\n";
        label += "3. Find your music player in the list.\n";
        label += "4. Look at the <b>wmclass:</b> or <b>app:</b> field. That is your App ID! ";
        label += "<i>(Remove the .desktop part)</i>\n";
        label += "5. Press Esc to close the debugger."

        const helpLabel = new Gtk.Label({
            label: label,
            use_markup: true,
            justify: Gtk.Justification.LEFT,
            xalign: 0,
            wrap: true,
            margin_top: 15,
            margin_bottom: 15,
            margin_start: 15,
            margin_end: 15
        });
        this.add_row(helpLabel);
    }
}