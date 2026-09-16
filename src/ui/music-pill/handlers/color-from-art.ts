import Gio from "gi://Gio";
import GdkPixbuf from "gi://GdkPixbuf";
import { Color } from "@/types/color";
import { getAverageColor, getClosestGnomeAccent } from "@/utils/color";
import { logDebug } from "@/utils/log";

export type ColorFromArtCallbacks = {
    onColor(color: Color): void;
    syncAccent?: boolean;
    setAccent?: (name: string) => void;
};

/**
 * Faithful async art→color pipeline from srcJS/uiMusicPill.js `_loadColorFromArt`.
 */
export class ArtColorLoader {
    private _cancellable: Gio.Cancellable | null = null;

    load(artUrl: string, cb: ColorFromArtCallbacks): void {
        if (!artUrl) {
            return;
        }

        if (this._cancellable) {
            this._cancellable.cancel();
        }
        this._cancellable = new Gio.Cancellable();
        const cancellable = this._cancellable;
        const file = Gio.File.new_for_uri(artUrl);

        file.load_contents_async(cancellable, (f, res) => {
            try {
                const [ok, bytes] = f!.load_contents_finish(res);
                if (!ok) {
                    return;
                }
                const stream = Gio.MemoryInputStream.new_from_bytes(bytes);
                GdkPixbuf.Pixbuf.new_from_stream_async(stream, cancellable, (_source, pixRes) => {
                    try {
                        const pixbuf = GdkPixbuf.Pixbuf.new_from_stream_finish(pixRes);
                        if (!pixbuf) {
                            return;
                        }
                        const color = getAverageColor(pixbuf);
                        if (cb.syncAccent && cb.setAccent) {
                            try {
                                cb.setAccent(getClosestGnomeAccent(color.r, color.g, color.b));
                            } catch (err) {
                                logDebug(`Native accent sync failed: ${err}`);
                            }
                        }
                        cb.onColor(color);
                    } catch (pixErr: unknown) {
                        const e = pixErr as { matches?: Function; message?: string };
                        if (!e.matches || !e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED)) {
                            logDebug(`Failed to decode art pixbuf: ${e.message}`);
                        }
                    }
                });
            } catch (err: unknown) {
                const e = err as { matches?: Function; message?: string };
                if (!e.matches || !e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED)) {
                    logDebug(`Failed to load art color: ${e.message}`);
                }
            }
        });
    }

    cancel(): void {
        if (this._cancellable) {
            this._cancellable.cancel();
            this._cancellable = null;
        }
    }
}
