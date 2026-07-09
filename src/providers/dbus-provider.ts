import Gio from "gi://Gio";
import { getDBusSessionAddress } from "@/utils/development";
import { smartUnpack } from "@/utils/packing";
import { MPRIS_INTERFACE, PLAYER_INTERFACE } from "@/constants/mpris-constants";
import { logInfo, logObject } from "@/utils/log";

export interface DBusProvider {
    listNames(): string[];
    destroy(): void;
}

export function createDBusProvider(): DBusProvider {
    const address = getDBusSessionAddress();
    logInfo(`DBus address: ${address}`);

    const flags = Gio.DBusConnectionFlags.AUTHENTICATION_CLIENT | Gio.DBusConnectionFlags.MESSAGE_BUS_CONNECTION;
    const connection = Gio.DBusConnection.new_for_address_sync(address, flags, null, null);
    

    function listNames() {
        const result = connection.call_sync(
            'org.freedesktop.DBus',
            '/org/freedesktop/DBus',
            'org.freedesktop.DBus',
            'ListNames',
            null, null,
            Gio.DBusCallFlags.NONE,
            -1,
            null
        );

        const names = smartUnpack(result)[0];
        logInfo(`Names: ${names.filter((name: string) => name.startsWith(`${PLAYER_INTERFACE}`)).join(", ")}`);
        
        return names.filter((name: string) => name.startsWith(`${PLAYER_INTERFACE}.`));
    }

    function destroy() {
        connection.close_sync(null);
    }

    return { listNames, destroy};
}