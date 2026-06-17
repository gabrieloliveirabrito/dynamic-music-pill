import { IMPrisProvider, MPRISCallback } from "@/interfaces/impris-provider";
import { TrackInfo } from "@/types/track-info";
import { logInfo } from "@/utils/log";
import GLib from "@girs/glib-2.0";

export function createMockMPRISProvider(): IMPrisProvider {
    let intervalId: number | null = null;
    let callbacks = new Map<string, MPRISCallback>();
    let counter: number = 0;

    function emit(track: TrackInfo) {
        callbacks.forEach((callback, key) => {
            logInfo(`Emiting track ${track.title} of callback ${key}`);

            callback(track);
        });
    }

    function start() {
        logInfo(`Starting MPRIS mock provider`);
        intervalId = GLib.timeout_add(
            GLib.PRIORITY_DEFAULT,
            5000,
            () => {
                counter++;

                emit({
                    title: `Test track ${counter}`,
                    artist: ["Enygma"],
                    album: "None"
                });

                return GLib.SOURCE_CONTINUE;
            }
        );
        logInfo(`Created GLib timeout with id ${intervalId}`);
    }

    function stop() {
        if (intervalId) {
            //Clear interval?
        }
    }

    function addCallback(name: string, callback: MPRISCallback): void {
        if (callbacks.has(name)) {
            logError(`Callback ${name} already exists!`);
            return;
        }

        callbacks.set(name, callback);
    }

    function removeCallback(name: string): boolean {
        if (!callbacks.has(name)) {
            return false;
        }

        return callbacks.delete(name);
    }

    return { start, stop, addCallback, removeCallback }
}