export type TrackInfo = {
    playbackStatus?: boolean;
    title?: string;
    artist?: string[];
    album?: string;
    artUrl?: string;
    length?: number;
    trackId?: string;
    canPlay?: boolean;
    canPause?: boolean;
    canSeek?: boolean;
    canGoPrevious?: boolean;
    canGoNext?: boolean;
}