import Adw from "gi://Adw"
import Gtk from "gi://Gtk"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { ActionRowProps } from "@/types/shell-types"
import { smartUnpack } from "@/utils/packing"
import { t } from "@/utils/translate"
import { MPRISProvider } from "@/providers/mpris-provider"

export class DetectedPlayersRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, mpris: MPRISProvider, properties: ActionRowProps, ...args: any[]) {
        super(properties, args)

        const refreshBtn = new Gtk.Button({
            icon_name: "view-refresh-symbolic",
            valign: Gtk.Align.CENTER,
            margin_end: 10,
            css_classes: ["flat"]
        })
        this.add_prefix(refreshBtn)

        const playerBox = new Gtk.Box({ spacing: 6, valign: Gtk.Align.CENTER })
        this.add_suffix(playerBox)

        const updateDetected = () => {
            let child = playerBox.get_first_child()
            while (child) {
                let next = child.get_next_sibling()
                playerBox.remove(child)
                child = next
            }

            try {
                const mprisNames = mpris.listPlayers();

                let apps = mprisNames.map(n => n.replace('org.mpris.MediaPlayer2.', '').split('.')[0]);
                if (apps.length === 0) {
                    playerBox.append(new Gtk.Label({ label: t('No players found') }));
                } else {
                    for (const app of apps) {
                        let btn = new Gtk.Button({ label: app, css_classes: ['suggested-action'] });
                        btn.connect('clicked', () => {
                            let current = settings.system.filteredPlayers
                            let list = current.split(',').map(s => s.trim()).filter(s => s.length > 0);
                            if (!list.includes(app)) {
                                list.push(app);
                                settings.system.filteredPlayers = list.join(',');
                            }
                        });
                        playerBox.append(btn);
                    }
                }
            }
            catch (e) {
                logError(e);
            }
        }
        refreshBtn.connect("clicked", updateDetected)
        updateDetected();

        settings.system.connect("changed::player-filter-mode", () => {
            this.set_sensitive(settings.system.playerFilterMode !== 0);
        });
        this.set_sensitive(settings.system.playerFilterMode !== 0);

        this.add_suffix(playerBox);
    }
}