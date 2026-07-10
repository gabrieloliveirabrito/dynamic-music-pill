import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { logInfo, logObject } from "./log";

export function loadEnv() {
    try {
        const xdgRuntimeDir = GLib.getenv("XDG_RUNTIME_DIR");
        if (!xdgRuntimeDir) {
            throw new Error("XDG_RUNTIME_DIR is not set");
        }

        const envPath = `${xdgRuntimeDir}/dynamic-music-pill.env`;
        if (!GLib.file_test(envPath, GLib.FileTest.EXISTS)) {
            logObject(process.env.NODE_ENV);
            return;
        }

        parseEnvFile(envPath);
    } catch (error) {
        logError(error);
    }
}

function parseEnvFile(envPath: string) {
    const file = Gio.File.new_for_path(envPath);
    if (!file) {
        logInfo(`Failed to load env file: ${envPath}`);
        return;
    }

    const fileStream = file.read(null);
    const dataStream = new Gio.DataInputStream({
        base_stream: fileStream,
        byte_order: Gio.DataStreamByteOrder.BIG_ENDIAN,
    });

    const encoder = new TextDecoder("utf-8");

    while (true) {
        const [buffer, length] = dataStream.read_line(null);
        if (buffer === null || length === 0) {
            break;
        }

        const line = encoder.decode(buffer).trim();
        if (line.startsWith("#") || line.length === 0) {
            continue;
        }

        const firstKeySeparatorIndex = line.indexOf("=");
        if (firstKeySeparatorIndex === -1) {
            continue;
        }

        const key = line.substring(0, firstKeySeparatorIndex);
        const value = line.substring(firstKeySeparatorIndex + 1);

        GLib.setenv(key, value, true);
    }

    dataStream.close(null);
    fileStream.close(null);
}