import { PlayerInfo } from "@/types/player-types";
import { MapperType } from "@/utils/mapper";

export const PlayerStateMap : MapperType<PlayerInfo> = {
    "PlaybackStatus": (s, v) => s.playbackStatus = v,
    "CanControl": (s, v) => s.canControl = v,
    "CanGoNext": (s, v) => s.canGoNext = v,
    "CanGoPrevious": (s, v) => s.canGoPrevious = v,
    "CanPause": (s, v) => s.canPause = v,
    "CanPlay": (s, v) => s.canPlay = v,
    "CanSeek": (s, v) => s.canSeek = v,
    "MaximumRate": (s, v) => s.maximumRate = v,
    "MinimumRate": (s, v) => s.minimumRate = v,
    "Volume": (s, v) => s.volume = v,
    "Position": (s, v) => s.position = v,
}