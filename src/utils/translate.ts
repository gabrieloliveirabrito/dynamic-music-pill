import { gettext as _ } from "@girs/gnome-shell/extensions/prefs"

export function t(key: string) : string {
    return _(key);
}