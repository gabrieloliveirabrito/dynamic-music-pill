import { TrackInfo } from "@/types/track-info"

export const MPRIS_INTERFACE = "org.mpris.MediaPlayer2.Player"
export const MPRIS_OBJECT = "/org/mpris/MediaPlayer2"

export const DefaultTrackInfo: TrackInfo =
    { length: 0, canGoNext: false, canGoPrevious: false, canPause: false, canPlay: false, canSeek: false, rate: 1 }