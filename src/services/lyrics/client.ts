import Soup from "gi://Soup";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { logDebug } from "@/utils/log";

const decode = (data: Uint8Array) => new TextDecoder().decode(data);
const CJK_RE = /[\u3040-\u9FFF\uAC00-\uD7AF]/;

export type LyricLine = { time: number; text: string };

type LrcItem = {
    id?: number;
    duration?: number;
    syncedLyrics?: string;
};

export class LyricsClient {
    private _session: InstanceType<typeof Soup.Session> | null;

    constructor() {
        Gio._promisify(
            Soup.Session.prototype,
            "send_and_read_async",
            "send_and_read_finish",
        );
        this._session = new Soup.Session();
    }

    async getLyrics(
        title: string,
        artist: string,
        album: string,
        duration: number,
        languagePreference = 0
    ): Promise<LyricLine[] | null> {
        if (!this._session) {
            return null;
        }
        if (!title?.trim() && !artist?.trim()) {
            return null;
        }
        if (!duration || duration <= 0) {
            return null;
        }

        try {
            const url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(title || "")}&artist_name=${encodeURIComponent(artist || "")}&album_name=${encodeURIComponent(album || "")}&duration=${duration}`;
            const [exactItem, candidates] = await Promise.all([
                this._fetchExact(url),
                this._fetchCandidates(title, artist, duration),
            ]);

            if (exactItem?.syncedLyrics) {
                const alreadyIn = candidates.some(c => c.id === exactItem.id);
                if (!alreadyIn) {
                    candidates.unshift(exactItem);
                }
            }
            if (candidates.length === 0) {
                return null;
            }

            let best: LrcItem | null = null;
            let bestScore = -Infinity;
            for (const item of candidates) {
                if (!item.syncedLyrics) {
                    continue;
                }
                const durationScore = -Math.abs((item.duration || 0) - duration);
                const prefScore = this._scoreItem(item, languagePreference) * 1000;
                const total = prefScore + durationScore;
                if (total > bestScore) {
                    bestScore = total;
                    best = item;
                }
            }
            return best?.syncedLyrics ? this._parseLRC(best.syncedLyrics) : null;
        } catch (e) {
            logDebug(`Lyrics fetch error: ${(e as Error).message}`);
            throw e;
        }
    }

    destroy(): void {
        if (this._session) {
            this._session.abort();
            this._session = null;
        }
    }

    private _detectScript(lines: LyricLine[]): string {
        if (!lines.length) {
            return "unknown";
        }
        const sample = lines.slice(0, Math.min(15, lines.length)).map(l => l.text).join(" ");
        const cjkCount = (sample.match(new RegExp(CJK_RE.source, "g")) || []).length;
        const latinCount = (sample.match(/[a-zA-Z]/g) || []).length;
        const totalChars = sample.replace(/\s/g, "").length;
        if (totalChars === 0) {
            return "unknown";
        }
        if (cjkCount / totalChars > 0.15) {
            return "original";
        }
        if (latinCount / totalChars > 0.4) {
            return "latin";
        }
        return "unknown";
    }

    private _scoreItem(item: LrcItem, pref: number): number {
        if (!item.syncedLyrics) {
            return -1;
        }
        if (pref === 0) {
            return 0;
        }
        const parsed = this._parseLRC(item.syncedLyrics);
        const script = this._detectScript(parsed);
        if (pref === 1) {
            return script === "original" ? 2 : (script === "unknown" ? 0 : 1);
        }
        if (pref === 2) {
            return script === "latin" ? 2 : (script === "unknown" ? 0 : 1);
        }
        return 0;
    }

    private async _fetchExact(url: string): Promise<LrcItem | null> {
        if (!this._session) {
            return null;
        }
        try {
            const msg = Soup.Message.new("GET", url);
            if (!msg) {
                return null;
            }
            const bytes = await this._session.send_and_read_async(msg, GLib.PRIORITY_DEFAULT, null);
            if (msg.status_code === Soup.Status.OK) {
                try {
                    return JSON.parse(decode(bytes.get_data()));
                } catch {
                    return null;
                }
            }
            return null;
        } catch (e) {
            logDebug(`Exact lyrics fetch error: ${(e as Error).message}`);
            return null;
        }
    }

    private async _fetchCandidates(title: string, artist: string, duration: number): Promise<LrcItem[]> {
        if (!this._session || !title?.trim()) {
            return [];
        }
        const url = `https://lrclib.net/api/search?q=${encodeURIComponent(`${title} ${artist || ""}`)}`;
        const msg = Soup.Message.new("GET", url);
        if (!msg) {
            return [];
        }
        const bytes = await this._session.send_and_read_async(msg, GLib.PRIORITY_DEFAULT, null);
        const data = JSON.parse(decode(bytes.get_data()));
        return Array.isArray(data)
            ? data.filter((item: LrcItem) => Math.abs((item.duration || 0) - duration) < 5)
            : [];
    }

    private _parseLRC(lrcText: string): LyricLine[] {
        const lines: LyricLine[] = [];
        const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
        for (const line of lrcText.split("\n")) {
            const match = line.match(regex);
            if (!match) {
                continue;
            }
            const time =
                parseInt(match[1]) * 60 * 1000 +
                parseInt(match[2]) * 1000 +
                parseFloat(`0.${match[3]}`) * 1000;
            if (match[4].trim()) {
                lines.push({ time, text: match[4].trim() });
            }
        }
        return lines;
    }
}
