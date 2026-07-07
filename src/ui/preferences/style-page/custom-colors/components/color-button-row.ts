import Adw from "gi://Adw";
import Gtk from "gi://Gtk";
import Gdk from "gi://Gdk";
import GObject from "gi://GObject";
import { SettingsProvider } from "@/providers/settings-provider";
import { ActionRowProps } from "@/types/shell-types";

export class ColorButtonRow extends Adw.ActionRow {
    static {
        GObject.registerClass(this);
    }

    constructor(settings: SettingsProvider, settingsKey: "customBgColor" | "customTextColor", props: ActionRowProps, ...args: any[]) {
        super(props, args);

        const cStr = settings.style[settingsKey].split(',');
        const c = new Gdk.RGBA();
        c.parse(`rgb(${cStr[0] || 40},${cStr[1] || 40},${cStr[2] || 40})`);

        const btn = new Gtk.ColorButton({
            rgba: c,
            use_alpha: false,
            valign: Gtk.Align.CENTER
        })

        btn.connect('color-set', () => {
            const rgba = btn.get_rgba();
            const colorStr = `${Math.round(rgba.red * 255)},${Math.round(rgba.green * 255)},${Math.round(rgba.blue * 255)}`;

            settings.style[settingsKey] = colorStr;
        });

        settings.style.connect(`changed::${settingsKey}`, () => {
            const cStr = settings.style[settingsKey].split(',');
            const c = new Gdk.RGBA();
            c.parse(`rgb(${cStr[0] || 40},${cStr[1] || 40},${cStr[2] || 40})`);

            btn.set_rgba(c);
        });

        this.add_suffix(btn);
        settings.style.bind("syncAccentColor", this, "sensitive");
        settings.style.bind("useCustomColors", this, "sensitive");
    }
}