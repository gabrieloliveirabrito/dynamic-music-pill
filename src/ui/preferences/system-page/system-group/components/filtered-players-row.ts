import Adw from "gi://Adw"
import GObject from "gi://GObject"
import { SettingsProvider } from "@/providers/settings-provider"
import { EntryRowProps } from "@/types/shell-types";

export class FilteredPlayersRow extends Adw.EntryRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, properties: EntryRowProps, ...args: any[]) {
        super(properties, args);

        this.set_text(settings.system.filteredPlayers)
        settings.system.bind("filteredPlayers", this, "text")
        settings.system.connect("changed::player-filter-mode", () => {
            this.set_sensitive(settings.system.playerFilterMode !== 0);
        });
        this.set_sensitive(settings.system.playerFilterMode !== 0);
    }
}