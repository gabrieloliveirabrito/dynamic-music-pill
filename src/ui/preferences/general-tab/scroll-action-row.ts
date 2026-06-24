import { SettingsProvider } from "@/providers/settings-provider"
import Adw from "gi://Adw"
import GObject from "gi://GObject"
import Gtk from "gi://Gtk"

const ActionIdMap: { [K: string]: number | never } = {
    'volume': 1,
    'player': 2,
    'seek': 3,
}

export class ScrollActionRow extends Adw.ComboRow {
    static {
        GObject.registerClass(this)
    }

    constructor(settings: SettingsProvider, properties?: Partial<Adw.ComboRow.ConstructorProps>, ...args: any[]) {
        super(properties, args);

        const scrollActionModel = new Gtk.StringList();
        scrollActionModel.append(_("Change Track"));
        scrollActionModel.append(_("Change Volume"));
        scrollActionModel.append(_("Switch Player"));
        scrollActionModel.append(_("Seek ±10s"));

        let currentAction = settings.scrollControls.action;
        let selectedIdx = ActionIdMap[currentAction] ?? 0;

        this.set_model(scrollActionModel);
        this.set_selected(selectedIdx);

        settings.connect("changed::scroll-action", () => {
            const action = settings.scrollControls.action;

            this.selected = ActionIdMap[action] ?? 0;
        });

        this.connect("notify::selected", () => {
            let val = 'track';

            if (this.selected === 1)
                val = 'volume';
            else if (this.selected === 2)
                val = 'player';
            else if (this.selected === 3)
                val = 'seek';

            settings.scrollControls.action = val;
        });

        settings.scrollControls.bind("enabled", this, 'sensitive');
    }
}