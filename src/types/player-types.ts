export type TrackInfo = {
    title?: string;
    artist?: string[];
    album?: string;
    artUrl?: string;
    trackId?: string;
    length: number;
    rate: number;
}

export type PlaybackStatus = "Playing" | "Paused" | "Stopped";

export type PlayerInfo = {
    playbackStatus: PlaybackStatus;
    canControl: boolean;
    canGoNext: boolean;
    canGoPrevious: boolean;
    canPause: boolean;
    canPlay: boolean;
    canSeek: boolean;
    volume: number;
    minimumRate: number;
    maximumRate: number;
    position: number;
}