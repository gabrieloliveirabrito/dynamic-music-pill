export type TrackInfo = {
    title?: string;
    artist?: string[];
    album?: string;
    artUrl?: string;
    trackId?: string;
    length: number;
}

export type PlaybackStatus = "Playing" | "Paused" | "Stopped";

export type PlayerState = {
    playbackStatus: PlaybackStatus;
    canPlay: boolean;
    canPause: boolean;
    canSeek: boolean;
    canGoNext: boolean;
    canGoPrevious: boolean;
    rate: number;
}