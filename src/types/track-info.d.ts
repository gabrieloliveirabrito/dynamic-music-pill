export type TrackInfo = {
    playbackStatus?: string;
    title?: string;
    artist?: string[];
    album?: string;
    artUrl?: string;
    trackId?: string;
    length: number;
    canPlay: boolean;
    canPause: boolean;
    canSeek: boolean;
    canGoPrevious: boolean;
    canGoNext: boolean;
    rate: number;
}