import { MediaPlayer } from "@/providers/mpris-provider/media-player";
import { isPlayerAllowed } from "@/providers/mpris-provider/player-filter";
import { SettingsProvider } from "@/providers/settings-provider";
import { DisplayTrack } from "@/types/player-types";
import { smartUnpack } from "@/utils/packing";

const BROWSER_PATTERN = /chrome|chromium|firefox|brave|edge|opera/;

export type ActivePlayerContext = {
    settings: SettingsProvider;
    players: MediaPlayer[];
    lastActionTime: number;
    lastWinnerName: string | null;
};

export function getActivePlayer(ctx: ActivePlayerContext): MediaPlayer | null {
    const { settings, players, lastActionTime, lastWinnerName } = ctx;

    if (players.length === 0) {
        return null;
    }

    const manualBus = settings.popup.selectedPlayerBus;
    if (manualBus && manualBus !== "") {
        const manual = players.find(p => p.getBusName() === manualBus);
        if (manual) {
            return manual;
        }
    }

    const now = Date.now();
    if (now - lastActionTime < 3000 && lastWinnerName) {
        const locked = players.find(p => p.getBusName() === lastWinnerName);
        if (locked) {
            return locked;
        }
    }

    const filterMode = settings.system.playerFilterMode;
    const filterList = settings.system.filteredPlayers
        .toLowerCase()
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    const scored = players.map(player => {
        let score = 0;
        const status = player.getPlayerInfo().playbackStatus;
        const track = player.getTrackInfo();
        if (track?.title) {
            const trackUrl = track.url ?? "";
            const isWeb = trackUrl.startsWith("http://") || trackUrl.startsWith("https://");
            if (isWeb && filterMode === 2) {
                const urlMatch = filterList.some(item => trackUrl.includes(item));
                if (!urlMatch) {
                    return { player, score: -1 };
                }
            }
        }

        const hasTitle = !!track?.title;
        if (status === "Playing" && hasTitle) {
            score = 500;
        } else if (status === "Paused" && hasTitle) {
            score = 100;
        }

        if (score === 0 && isBrowserBus(player.getBusName())) {
            score = -10;
        }

        return { player, score };
    });

    scored.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return b.player.getLastPlayingTime() - a.player.getLastPlayingTime();
    });

    if (scored.length === 0 || scored[0].score < 0) {
        return null;
    }

    let winner = scored[0].player;
    if (winner.getPlayerInfo().playbackStatus !== "Playing") {
        const anyPlaying = scored.find(s =>
            s.score > 0 &&
            s.player.getPlayerInfo().playbackStatus === "Playing" &&
            !!s.player.getTrackInfo()?.title
        );
        if (anyPlaying) {
            winner = anyPlaying.player;
        }
    }

    return winner;
}

export function resolveDisplayTrack(
    player: MediaPlayer,
    cached: DisplayTrack | null
): DisplayTrack {
    const track = player.getTrackInfo();
    const busName = player.getBusName();
    const status = player.getPlayerInfo().playbackStatus;

    let title = track?.title;
    let artist = formatArtist(track?.artist);
    let artUrl = track?.artUrl;

    if (!title && cached && cached.busName === busName && status !== "Stopped") {
        title = cached.title;
        artist = cached.artist ?? artist;
        artUrl = cached.artUrl ?? artUrl;
    }

    if (!title) {
        title = undefined;
        artist = undefined;
    }

    return {
        busName,
        title,
        artist,
        artUrl,
        url: player.getTrackInfo()?.url ?? "",
    };
}

function formatArtist(artist: string[] | undefined): string | undefined {
    if (!artist || artist.length === 0) {
        return undefined;
    }
    return artist.map(a => smartUnpack(a)).join(", ");
}

function isBrowserBus(busName: string): boolean {
    const short = busName.replace("org.mpris.MediaPlayer2.", "").split(".")[0].toLowerCase();
    return BROWSER_PATTERN.test(short);
}

export function isPlayerAllowedBySettings(busName: string, settings: SettingsProvider): boolean {
    return isPlayerAllowed(busName, settings.system);
}
