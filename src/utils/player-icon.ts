import Gio from "gi://Gio";

export type PlayerIconSource = {
    getDesktopEntry?(): string | null;
    getIdentity?(): string | null;
};

export function getPlayerIcon(player: PlayerIconSource | null, busName: string): Gio.Icon {
    const names: string[] = [];

    const desktopEntry = player?.getDesktopEntry?.();
    if (desktopEntry) {
        const de = desktopEntry.replace(".desktop", "");
        names.push(de, de.toLowerCase());
    }

    if (busName) {
        const raw = busName.replace("org.mpris.MediaPlayer2.", "").split(".")[0];
        names.push(raw.toLowerCase(), raw);
    }

    const identity = player?.getIdentity?.();
    if (identity) {
        const id = identity.toLowerCase().replace(/ /g, "-");
        names.push(id);
    }

    names.push("audio-x-generic");

    for (const name of names) {
        if (!name) {
            continue;
        }
        const icon = Gio.ThemedIcon.new(name);
        if (icon) {
            return icon;
        }
    }

    return Gio.ThemedIcon.new("audio-x-generic");
}
