import { SystemSettingsType } from "@/providers/settings-provider/system";

export function isPlayerAllowed(busName: string, system: SystemSettingsType): boolean {
    const mode = system.playerFilterMode;
    if (mode === 0) {
        return true;
    }

    const listStr = system.filteredPlayers.toLowerCase();
    const list = listStr.split(",").map(s => s.trim()).filter(s => s.length > 0);

    if (list.length === 0) {
        return mode === 1;
    }

    const lowerName = busName.toLowerCase();
    const match = list.some(item => lowerName.includes(item));

    if (mode === 1) {
        return !match;
    }
    if (mode === 2) {
        return match;
    }
    return true;
}
