import GLib from "@girs/glib-2.0";

export function isDevelopment() : boolean {
    const devMode : number | null = Number(GLib.getenv("DEV_MODE"));

    return !!devMode && !isNaN(devMode) && devMode == 1;
}

export function getDBusSessionAddress() : string {
    const dbusParent : string | null = GLib.getenv("DBUS_PARENT");

    if (dbusParent) {
        return dbusParent;
    }

    const address : string | null = GLib.getenv("DBUS_SESSION_BUS_ADDRESS");
    if (address === null) {
        throw new Error("Failed to find the DBus address");
    }

    return address;
}